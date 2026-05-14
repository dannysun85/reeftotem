from datetime import datetime
import logging
import os
from sqlalchemy.orm import Session
from app import models as _models
from app.core.database import SessionLocal, engine, Base
from app.crud.user import create_user, get_user_by_email
from app.crud.content import create_config, get_config, create_content_item, get_content_items
from app.crud.product import create_product, get_product_by_slug
from app.crud.download import create_download, get_downloads
from app.schemas.user import UserCreate, UserRole
from app.schemas.content import SiteConfigCreate, ContentItemCreate
from app.schemas.product import ProductCreate
from app.schemas.download import DownloadItemCreate, OSType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_initial_admin_credentials() -> tuple[str, str]:
    admin_email = os.getenv("REEFTOTEM_ADMIN_EMAIL", "admin@reeftotem.ai")
    admin_password = os.getenv("REEFTOTEM_ADMIN_PASSWORD")
    is_production = os.getenv("REEFTOTEM_ENV") == "production"

    if admin_password:
        return admin_email, admin_password

    if is_production:
        raise RuntimeError("REEFTOTEM_ADMIN_PASSWORD must be set before production initial_data runs")

    logger.warning("Using development default admin password. Set REEFTOTEM_ADMIN_PASSWORD before production.")
    return admin_email, "adminpassword"

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Create Superuser
        admin_email, admin_password = get_initial_admin_credentials()
        user = get_user_by_email(db, email=admin_email)
        if not user:
            user_in = UserCreate(
                email=admin_email,
                password=admin_password,
                full_name="Admin User",
                role=UserRole.SUPER_ADMIN,
                is_active=True
            )
            create_user(db, user=user_in)
            logger.info("Super user created: %s", admin_email)
        else:
            logger.info("Super user already exists")

        # 2. Site Config
        if not get_config(db, "site_info"):
            config_in = SiteConfigCreate(
                key="site_info",
                value={
                    "logo": {"url": "", "alt": "ReefTotem"},
                    "banner": {
                        "title": "ReefTotem AI 公司操作系统",
                        "subtitle": "面向真实公司运营的 AI 员工协作与交付平台，覆盖公司创建、员工组织、项目立项、执行日志和交付审核。",
                        "ctaText": "进入控制台",
                        "ctaLink": "/products",
                        "backgroundUrl": ""
                    },
                    "footer": {
                        "copyright": "© 2026 深圳前海瑞孚图腾科技有限公司 All rights reserved.",
                        "contactEmail": "contact@reeftotem.ai",
                        "contactPhone": "+86 0755-12345678",
                        "address": "深圳市前海深港合作区"
                    }
                },
                description="Global site configuration"
            )
            create_config(db, config_in)
            logger.info("Site config initialized")

        # 3. Features (Content Items)
        existing_features = get_content_items(db, type="feature")
        if not existing_features:
            features = [
                {
                    "title": "公司创建与公司包",
                    "content": "用户创建不同类型公司，安装适配行业的制度、员工、流程和工具能力包。",
                    "meta_data": {"icon": "Building2", "color": "from-tech-cyan to-blue-600"},
                    "sort_order": 1
                },
                {
                    "title": "AI 员工组织",
                    "content": "维护岗位、人格、记忆、心跳、上下级关系和协作边界，让员工能在公司流程内工作。",
                    "meta_data": {"icon": "Users", "color": "from-tech-cyan to-blue-600"},
                    "sort_order": 2
                },
                {
                    "title": "交付可追踪",
                    "content": "项目目标进入公司后，拆解为 Issue、Run、事件日志和 WorkProduct，由用户审核交付结果。",
                    "meta_data": {"icon": "ClipboardCheck", "color": "from-bright-purple to-indigo-600"},
                    "sort_order": 3
                },
                {
                    "title": "安全边界",
                    "content": "真实公司记忆和客户上下文留在公司实例内，可售员工模板与公司包必须脱敏。",
                    "meta_data": {"icon": "Shield", "color": "from-yellow-400 to-orange-500"},
                    "sort_order": 4
                }
            ]
            for f in features:
                create_content_item(db, ContentItemCreate(type="feature", **f))
            logger.info("Feature items initialized")

        # 4. Products
        if not get_product_by_slug(db, "hermes-company-os"):
            p1 = ProductCreate(
                name="Hermes Company OS",
                slug="hermes-company-os",
                short_desc="AI 公司运营与交付平台",
                full_desc="Hermes Company OS 支持用户创建公司、安装公司包、招聘 AI 员工、提交项目目标，并通过 Issue、Run、日志和 WorkProduct 完成交付审核。",
                icon_url="",
                features=["公司创建", "AI 员工组织", "项目立项", "Run 与 WorkProduct 审核"],
                sort_order=1,
                is_published=True
            )
            create_product(db, p1)
            logger.info("Product 'Hermes Company OS' created")

        if not get_product_by_slug(db, "reeftotem-software-company"):
            p2 = ProductCreate(
                name="ReefTotem 软件公司包",
                slug="reeftotem-software-company",
                short_desc="软件开发公司的岗位、制度与交付流程",
                full_desc="ReefTotem 软件公司包用于验证产品自身的自运营开发流程，包括项目文档读取、代码迭代、版本日志、GitHub Issue 和交付审核。",
                icon_url="",
                features=["管理岗汇报", "工程执行", "文档驱动开发", "版本升级流程"],
                sort_order=2,
                is_published=True
            )
            create_product(db, p2)
            logger.info("Product 'ReefTotem 软件公司包' created")

        if not get_product_by_slug(db, "security-detection-company"):
            p3 = ProductCreate(
                name="音视频安全检测公司能力",
                slug="security-detection-company",
                short_desc="面向内容安全与风险检测的行业能力方向",
                full_desc="该方向聚焦语音、视频、内容和风险检测流程，会通过行业公司包或项目交付接入 Hermes Company OS。",
                icon_url="",
                features=["内容安全识别", "风险事件追踪", "企业流程接入", "私有化交付评估"],
                sort_order=3,
                is_published=True
            )
            create_product(db, p3)
            logger.info("Product '音视频安全检测公司能力' created")

        # 5. Downloads
        # Check if we have document entries for Hermes Company OS
        p1_obj = get_product_by_slug(db, "hermes-company-os")
        if p1_obj:
            existing_downloads = get_downloads(db, product_id=p1_obj.id)
            if not existing_downloads:
                d1 = DownloadItemCreate(
                    product_id=p1_obj.id,
                    name="Hermes Company OS Console",
                    version="2.2.x",
                    platform="Web",
                    os_type=OSType.OTHER,
                    category="reeftotem",
                    package_url="https://opc.reeftotem.ai/login",
                    file_size="Web",
                    release_date=datetime(2026, 5, 9),
                    description="产品控制台入口，用于公司创建、员工组织、项目立项和交付审核。",
                    is_latest=True
                )
                create_download(db, d1)
                
                d2 = DownloadItemCreate(
                    product_id=p1_obj.id,
                    name="Production Deployment Runbook",
                    version="2026-05-09",
                    platform="Documentation",
                    os_type=OSType.OTHER,
                    category="reeftotem",
                    package_url="https://reeftotem.ai/downloads",
                    file_size="Doc",
                    release_date=datetime(2026, 5, 9),
                    is_latest=True
                )
                create_download(db, d2)
                logger.info("Document entries for Hermes Company OS initialized")

        # 6. About Us & Contact Us (New Content Types)
        # About Us - Team Members
        existing_team = get_content_items(db, type="team")
        if not existing_team:
            team_members = [
                {
                    "title": "Alex Chen",
                    "subtitle": "CEO & Founder",
                    "content": "负责 ReefTotem 公司运营平台的产品方向、公司包边界和商业化验证。",
                    "image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
                    "sort_order": 1
                },
                {
                    "title": "Sarah Li",
                    "subtitle": "CTO",
                    "content": "负责 Hermes Company OS 的工程架构、部署流程和 AI 员工执行路径。",
                    "image_url": "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=256",
                    "sort_order": 2
                },
                {
                    "title": "Mike Wang",
                    "subtitle": "Product Director",
                    "content": "负责公司创建、员工组织、项目立项、工作间和交付审核体验。",
                    "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
                    "sort_order": 3
                }
            ]
            for m in team_members:
                create_content_item(db, ContentItemCreate(type="team", **m))
            logger.info("Team members initialized")

        # Contact Info (Using ContentItem for flexible contact methods)
        existing_contacts = get_content_items(db, type="contact_method")
        if not existing_contacts:
            contacts = [
                {
                    "title": "商务合作",
                    "subtitle": "business@reeftotem.ai",
                    "content": "适合沟通行业公司包、私有化部署、公司能力复制和业务试运行。",
                    "meta_data": {"icon": "Briefcase"},
                    "sort_order": 1
                },
                {
                    "title": "技术支持",
                    "subtitle": "support@reeftotem.ai",
                    "content": "如果您在使用产品过程中遇到任何问题，请随时联系我们。",
                    "meta_data": {"icon": "Wrench"},
                    "sort_order": 2
                },
                {
                    "title": "加入我们",
                    "subtitle": "careers@reeftotem.ai",
                    "content": "寻找能把 AI 员工、公司流程、交付系统和安全边界落地的人。",
                    "meta_data": {"icon": "Users"},
                    "sort_order": 3
                }
            ]
            for c in contacts:
                create_content_item(db, ContentItemCreate(type="contact_method", **c))
            logger.info("Contact methods initialized")
        
        # 7. Additional Home Page Content (Hardcoded migration)
        
        # Hero Badge
        existing_hero_badge = get_content_items(db, type="hero_badge")
        if not existing_hero_badge:
            create_content_item(db, ContentItemCreate(
                type="hero_badge",
                title="Hermes Company OS",
                is_active=True
            ))
            logger.info("Hero badge initialized")

        # Hero Stats
        existing_hero_stats = get_content_items(db, type="hero_stat")
        if not existing_hero_stats:
            stats = [
                {"title": "首个验证公司", "content": "软件公司", "sort_order": 1},
                {"title": "核心链路", "content": "Issue/Run", "sort_order": 2},
                {"title": "交付审核", "content": "WorkProduct", "sort_order": 3}
            ]
            for s in stats:
                create_content_item(db, ContentItemCreate(type="hero_stat", **s))
            logger.info("Hero stats initialized")

        # Company Intro
        existing_company_intro = get_content_items(db, type="company_intro")
        if not existing_company_intro:
            create_content_item(db, ContentItemCreate(
                type="company_intro",
                title="关于 ReefTotem",
                subtitle="Shenzhen Qianhai ReefTotem Technology Co., Ltd.",
                content="深圳前海瑞孚图腾科技有限公司（ReefTotem）正在建设面向真实公司运营的 AI 员工协作与交付平台。\n\n用户从 SaaS 账号进入，创建公司，安装公司包，招聘 AI 员工，提交项目目标，再通过 Issue、Run、日志和 WorkProduct 审核结果。\n\n软件开发公司是第一家验证公司，后续会复制到研究交付、运营服务、内容交付和安全检测等不同公司类型。",
                image_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
                sort_order=1
            ))
            logger.info("Company intro initialized")
            
        # Home Section Titles
        existing_section_titles = get_content_items(db, type="home_section_title")
        if not existing_section_titles:
            # Product Showcase Title
            create_content_item(db, ContentItemCreate(
                type="home_section_title",
                title="从公司目标到交付审核",
                subtitle="用公司、员工、项目、Issue、Run 和 WorkProduct 把 AI 工作流落到真实运营里",
                meta_data={"section": "product_showcase"},
                sort_order=1
            ))
            logger.info("Home section titles initialized")

        # Company Intro Stats
        existing_stats = get_content_items(db, type="stat")
        if not existing_stats:
            company_stats = [
                {"title": "产品入口", "content": "opc", "sort_order": 1},
                {"title": "验证公司", "content": "ReefTotem", "sort_order": 2},
                {"title": "核心交付", "content": "WorkProduct", "sort_order": 3}
            ]
            for s in company_stats:
                create_content_item(db, ContentItemCreate(type="stat", **s))
            logger.info("Company stats initialized")

        logger.info("Initial data created successfully")

    finally:
        db.close()

if __name__ == "__main__":
    init_db()
