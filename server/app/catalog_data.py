from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.crud.download import create_download, get_downloads, update_download
from app.crud.product import create_product, get_product_by_slug, update_product
from app.core.database import SessionLocal
from app.models.download import DownloadItem
from app.models.product import Product
from app.schemas.download import DownloadItemCreate, DownloadItemUpdate, OSType
from app.schemas.product import ProductCreate, ProductUpdate


CURRENT_PRODUCTS: list[dict[str, Any]] = [
    {
        "slug": "opc",
        "name": "OPC 企业平台",
        "short_desc": "企业 AI 运营与自动化控制台",
        "full_desc": "面向企业创建 AI 公司、配置数字员工、跟踪项目、沉淀运行日志并审核 WorkProduct 交付结果。",
        "icon_url": "/images/brand/reeftotem-symbol-color.png",
        "cover_image_url": "/images/product/dashboard-company-home.png",
        "features": ["AI 公司创建", "数字员工组织", "项目交付记录", "WorkProduct 审核"],
        "is_published": True,
        "sort_order": 1,
        "docs_url": "https://opc.reeftotem.ai/login",
    },
    {
        "slug": "xingban-assistant",
        "name": "星伴 Assistant",
        "short_desc": "桌面 AI 入口，当前 macOS Apple Silicon 1.0.0 可下载",
        "full_desc": "面向个人和团队的桌面 AI 伴侣，承接聊天、长期记忆、提醒、活动记录和本地优先工作流。",
        "icon_url": "/images/brand/xingban-icon.png",
        "cover_image_url": "/images/product/xingban-desktop.png",
        "features": ["桌面常驻入口", "聊天与记忆", "提醒与轻量自动化", "macOS 1.0.0 下载"],
        "is_published": True,
        "sort_order": 2,
        "docs_url": "/downloads#install",
    },
    {
        "slug": "quantagent",
        "name": "QuantAgent",
        "short_desc": "自动量化系统，当前内测推进",
        "full_desc": "围绕策略 Alpha 深研、证据工厂、风险控制和自动化流程建设，完成后将在官网下载中心提供入口。",
        "icon_url": "/images/brand/reeftotem-symbol-color.png",
        "cover_image_url": "/images/product/quantagent-commercial.png",
        "features": ["策略 Alpha 深研", "证据门禁", "风险约束", "后续官网下载"],
        "is_published": True,
        "sort_order": 3,
        "docs_url": "/contact",
    },
    {
        "slug": "reeftotem-engineering",
        "name": "安全与交付体系",
        "short_desc": "公司级工程标准、发布和审计能力",
        "full_desc": "把产品发布、权限边界、审计、部署和回滚沉淀为公司级工程标准，支撑 OPC、星伴和 QuantAgent 的统一交付。",
        "icon_url": "/images/brand/reeftotem-symbol-color.png",
        "cover_image_url": "/images/brand/reeftotem-symbol-color.png",
        "features": ["发布规则", "权限边界", "部署回滚", "审计记录"],
        "is_published": True,
        "sort_order": 4,
        "docs_url": "/downloads#docs",
    },
]

CURRENT_DOWNLOADS: list[dict[str, Any]] = [
    {
        "product_slug": "xingban-assistant",
        "name": "Xingban Assistant macOS Apple Silicon",
        "version": "1.0.0",
        "platform": "macOS Apple Silicon",
        "os_type": OSType.MAC,
        "category": "desktop",
        "package_url": "/downloads/Xingban-Assistant-1.0.0-aarch64.dmg",
        "file_size": "71.34 MB",
        "release_date": datetime(2026, 5, 14),
        "description": "星伴 Assistant 1.0.0 macOS Apple Silicon 安装包。",
        "changelog": "首个官网下载版本，提供桌面 AI 入口、聊天、记忆和轻量自动化基础能力。",
        "is_latest": True,
        "is_visible": True,
    },
    {
        "product_slug": "opc",
        "name": "OPC 企业平台控制台",
        "version": "live",
        "platform": "Web",
        "os_type": OSType.OTHER,
        "category": "web",
        "package_url": "https://opc.reeftotem.ai/login",
        "file_size": "Web",
        "release_date": datetime(2026, 5, 15),
        "description": "企业 AI 运营与自动化控制台入口。",
        "is_latest": True,
        "is_visible": True,
    },
]

STALE_PRODUCT_SLUGS = {
    "hermes-company-os",
    "openclaw",
    "reefquant",
    "reeftotem-ai",
    "reeftotem-software-company",
    "security-detection-company",
}

STALE_DOWNLOAD_NAMES = {
    "Hermes Company OS Console",
    "Production Deployment Runbook",
    "ReefTotem Desktop",
    "ReefTotem for Mac",
}


def sync_product_catalog(db: Session) -> dict[str, int]:
    """Sync the public product/download catalog without deleting operator data."""
    product_count = 0
    download_count = 0
    hidden_products = 0
    hidden_downloads = 0

    products_by_slug: dict[str, Product] = {}
    for payload in CURRENT_PRODUCTS:
        product = get_product_by_slug(db, payload["slug"])
        if product:
            product = update_product(db, product.id, ProductUpdate(**payload))
        else:
            product = create_product(db, ProductCreate(**payload))
        if product:
            products_by_slug[payload["slug"]] = product
            product_count += 1

    for stale_slug in STALE_PRODUCT_SLUGS:
        product = get_product_by_slug(db, stale_slug)
        if product and product.is_published:
            update_product(db, product.id, ProductUpdate(is_published=False))
            hidden_products += 1

    current_downloads = get_downloads(db, limit=500)
    downloads_by_package_url = {item.package_url: item for item in current_downloads}
    downloads_by_name = {item.name: item for item in current_downloads}

    for payload in CURRENT_DOWNLOADS:
        product = products_by_slug.get(payload["product_slug"])
        download_payload = {
            key: value
            for key, value in payload.items()
            if key != "product_slug"
        }
        download_payload["product_id"] = product.id if product else None
        existing = downloads_by_package_url.get(download_payload["package_url"]) or downloads_by_name.get(download_payload["name"])

        if existing:
            update_download(db, existing.id, DownloadItemUpdate(**download_payload))
        else:
            create_download(db, DownloadItemCreate(**download_payload))
        download_count += 1

    for item in db.query(DownloadItem).filter(DownloadItem.name.in_(STALE_DOWNLOAD_NAMES)).all():
        if item.is_visible:
            update_download(db, item.id, DownloadItemUpdate(is_visible=False))
            hidden_downloads += 1

    return {
        "products": product_count,
        "downloads": download_count,
        "hidden_products": hidden_products,
        "hidden_downloads": hidden_downloads,
    }


def main() -> None:
    db = SessionLocal()
    try:
        result = sync_product_catalog(db)
        print(result)
    finally:
        db.close()


if __name__ == "__main__":
    main()
