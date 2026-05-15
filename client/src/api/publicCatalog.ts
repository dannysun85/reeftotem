import { useEffect, useMemo, useState } from 'react';
import { Box } from 'lucide-react';
import request from '@/api/request';
import {
  ASSISTANT_DOWNLOAD_URL,
  PRODUCT_CONSOLE_URL,
  deliveryProducts as fallbackDeliveryProducts,
  productSystem as fallbackProductSystem,
  type DeliveryProduct,
  type ProductSystemItem,
} from '@/data/site';

type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  short_desc?: string | null;
  full_desc?: string | null;
  icon_url?: string | null;
  cover_image_url?: string | null;
  features?: string[] | null;
  is_published?: boolean;
  sort_order?: number | null;
  docs_url?: string | null;
};

type ApiDownload = {
  id: string;
  product_id?: string | null;
  name: string;
  version: string;
  platform?: string | null;
  os_type?: string | null;
  category?: string | null;
  package_url: string;
  file_size?: string | null;
  description?: string | null;
  changelog?: string | null;
  download_count: number;
  is_latest?: boolean;
  is_visible?: boolean;
  release_date?: string | null;
};

export type CatalogDeliveryProduct = DeliveryProduct & {
  apiProductId?: string;
  downloadId?: string;
  packageUrl?: string;
  fileSize?: string | null;
  releaseDate?: string | null;
  downloadCount?: number;
  isApiBacked?: boolean;
};

export type CatalogProduct = ProductSystemItem & {
  apiProductId?: string;
  features?: string[];
  isApiBacked?: boolean;
};

type PublicCatalog = {
  products: ApiProduct[];
  downloads: ApiDownload[];
};

type CatalogState = {
  deliveryProducts: CatalogDeliveryProduct[];
  productSystem: CatalogProduct[];
  assistantDownload: CatalogDeliveryProduct;
  isLoading: boolean;
  isApiBacked: boolean;
  error: string | null;
};

const fallbackCatalogState: CatalogState = {
  deliveryProducts: fallbackDeliveryProducts,
  productSystem: fallbackProductSystem,
  assistantDownload: fallbackDeliveryProducts[0],
  isLoading: false,
  isApiBacked: false,
  error: null,
};

const presentationBySlug = new Map(fallbackProductSystem.map((product) => [product.slug, product]));
const deliveryBySlug = new Map(fallbackDeliveryProducts.map((product) => [product.slug, product]));
const knownSlugOrder = new Map(fallbackProductSystem.map((product, index) => [product.slug, index]));

export function usePublicCatalog(): CatalogState {
  const [catalog, setCatalog] = useState<CatalogState>({ ...fallbackCatalogState, isLoading: true });

  useEffect(() => {
    let alive = true;

    fetchPublicCatalog()
      .then((publicCatalog) => {
        if (!alive) return;
        setCatalog({ ...buildCatalogState(publicCatalog), isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!alive) return;
        setCatalog({
          ...fallbackCatalogState,
          error: error instanceof Error ? error.message : '无法读取官网产品目录 API，已使用静态降级数据。',
        });
      });

    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => catalog, [catalog]);
}

export async function recordDownloadClick(downloadId?: string) {
  if (!downloadId) return;

  try {
    await request.post(`/downloads/${downloadId}/count`);
  } catch {
    // 下载统计不能阻断用户获取安装包。
  }
}

async function fetchPublicCatalog(): Promise<PublicCatalog> {
  const [products, downloads] = await Promise.all([
    request.get<unknown, ApiProduct[]>('/products/'),
    request.get<unknown, ApiDownload[]>('/downloads/'),
  ]);

  return {
    products: Array.isArray(products) ? products : [],
    downloads: Array.isArray(downloads) ? downloads : [],
  };
}

function buildCatalogState(publicCatalog: PublicCatalog): CatalogState {
  const apiProducts = publicCatalog.products
    .filter((product) => product.is_published !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const productSlugById = new Map(apiProducts.map((product) => [product.id, product.slug]));
  const visibleDownloads = publicCatalog.downloads
    .filter((item) => item.is_visible !== false)
    .sort((a, b) => Number(Boolean(b.is_latest)) - Number(Boolean(a.is_latest)));

  const productSystem = buildProductSystem(apiProducts);
  const deliveryProducts = fallbackDeliveryProducts.map((fallback) => {
    const apiProduct = apiProducts.find((product) => product.slug === fallback.slug);
    const download = findDownloadForSlug(fallback.slug, visibleDownloads, productSlugById);
    const base = deliveryBySlug.get(fallback.slug) ?? fallback;

    if (!apiProduct && !download) {
      return base;
    }

    const href = download?.package_url || apiProduct?.docs_url || base.href;
    const isXingbanDownload = fallback.slug === 'xingban-assistant' && Boolean(download);

    return {
      ...base,
      apiProductId: apiProduct?.id,
      downloadId: download?.id,
      name: apiProduct?.name || base.name,
      status: getDeliveryStatus(fallback.slug, download, base.status),
      desc: getDeliveryDesc(fallback.slug, download, apiProduct, base.desc),
      longDesc: apiProduct?.full_desc || download?.description || base.longDesc,
      image: apiProduct?.icon_url || apiProduct?.cover_image_url || base.image,
      href,
      action: isXingbanDownload ? '下载 macOS 版' : base.action,
      packageUrl: download?.package_url,
      fileSize: download?.file_size,
      releaseDate: download?.release_date,
      downloadCount: download?.download_count,
      isApiBacked: true,
    };
  });

  const assistantDownload =
    deliveryProducts.find((item) => item.slug === 'xingban-assistant') ?? fallbackCatalogState.assistantDownload;

  return {
    deliveryProducts,
    productSystem: productSystem.length > 0 ? productSystem : fallbackProductSystem,
    assistantDownload,
    isLoading: false,
    isApiBacked: apiProducts.length > 0 || visibleDownloads.length > 0,
    error: null,
  };
}

function buildProductSystem(apiProducts: ApiProduct[]): CatalogProduct[] {
  const knownProducts = apiProducts
    .filter((product) => presentationBySlug.has(product.slug))
    .map((product) => overlayProduct(product, presentationBySlug.get(product.slug)!))
    .sort((a, b) => (knownSlugOrder.get(a.slug) ?? 99) - (knownSlugOrder.get(b.slug) ?? 99));

  const unknownProducts = apiProducts
    .filter((product) => !presentationBySlug.has(product.slug))
    .map((product): CatalogProduct => ({
      slug: product.slug,
      icon: Box,
      status: '后台发布',
      name: product.name,
      category: '产品能力',
      desc: product.full_desc || product.short_desc || '该产品由后台产品管理发布，前台已自动纳入产品体系。',
      image: product.cover_image_url || product.icon_url || '/images/brand/reeftotem-symbol-color.png',
      href: product.docs_url || '/contact',
      action: product.docs_url ? '查看详情' : '联系沟通',
      apiProductId: product.id,
      features: product.features ?? undefined,
      isApiBacked: true,
    }));

  return [...knownProducts, ...unknownProducts];
}

function overlayProduct(product: ApiProduct, fallback: ProductSystemItem): CatalogProduct {
  return {
    ...fallback,
    apiProductId: product.id,
    name: product.name || fallback.name,
    desc: product.full_desc || product.short_desc || fallback.desc,
    image: product.cover_image_url || product.icon_url || fallback.image,
    href: product.docs_url || fallback.href,
    features: product.features ?? undefined,
    isApiBacked: true,
  };
}

function findDownloadForSlug(
  slug: string,
  downloads: ApiDownload[],
  productSlugById: Map<string, string>
): ApiDownload | undefined {
  return downloads.find((download) => {
    const productSlug = download.product_id ? productSlugById.get(download.product_id) : undefined;
    const name = `${download.name} ${download.package_url}`.toLowerCase();

    if (productSlug === slug) return true;
    if (slug === 'xingban-assistant') return name.includes('xingban') || name.includes('星伴');
    if (slug === 'opc') return name.includes('opc') || name.includes('console') || name.includes('控制台');
    if (slug === 'quantagent') return name.includes('quantagent') || name.includes('quant');
    return false;
  });
}

function getDeliveryStatus(slug: string, download: ApiDownload | undefined, fallbackStatus: string): string {
  if (!download) return fallbackStatus;
  if (slug === 'xingban-assistant') return `${download.version} 可下载`;
  if (download.platform?.toLowerCase() === 'web') return '线上入口';
  if (download.is_latest) return '最新发布';
  return fallbackStatus;
}

function getDeliveryDesc(
  slug: string,
  download: ApiDownload | undefined,
  product: ApiProduct | undefined,
  fallbackDesc: string
): string {
  if (download && slug === 'xingban-assistant') {
    return [download.platform, download.file_size].filter(Boolean).join(' · ') || fallbackDesc;
  }

  if (download?.description) return download.description;
  return product?.short_desc || fallbackDesc;
}

export function getAssistantDownloadHref(item: CatalogDeliveryProduct): string {
  return item.packageUrl || item.href || ASSISTANT_DOWNLOAD_URL;
}

export function getOpcHref(item: CatalogDeliveryProduct | undefined): string {
  return item?.packageUrl || item?.href || PRODUCT_CONSOLE_URL;
}

export function formatReleaseDate(value?: string | null): string {
  if (!value) return '按当前官网发布';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '按当前官网发布';
  return date.toISOString().slice(0, 10);
}
