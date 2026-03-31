from datetime import datetime
import logging
from sqlalchemy.orm import Session
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

def init_db():
    db = SessionLocal()
    try:
        # 1. Create Superuser
        user = get_user_by_email(db, email="admin@reeftotem.ai")
        if not user:
            user_in = UserCreate(
                email="admin@reeftotem.ai",
                password="adminpassword",
                full_name="Admin User",
                role=UserRole.SUPER_ADMIN,
                is_active=True
            )
            create_user(db, user=user_in)
            logger.info("Super user created: admin@reeftotem.ai")
        else:
            logger.info("Super user already exists")

        # 2. Site Config
        if not get_config(db, "site_info"):
            config_in = SiteConfigCreate(
                key="site_info",
                value={
                    "logo": {"url": "", "alt": "ReefTotem"},
                    "banner": {
                        "title": "定义未来的智能数字生命",
                        "subtitle": "ReefTotem 瑞孚图腾致力于打造具备情感与智慧的 AI 伴侣。通过先进的大模型技术与二次元美学，为您连接虚拟与现实的桥梁。",
                        "ctaText": "开始体验",
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
                    "title": "二次元 AI 伴侣",
                    "content": "拥有独特个性和情感的虚拟角色，支持语音、文字多模态交互，为您带来沉浸式的陪伴体验。",
                    "meta_data": {"icon": "MessageSquare", "color": "from-neon-pink to-pink-600"},
                    "sort_order": 1
                },
                {
                    "title": "智能 Agent 服务",
                    "content": "强大的自主代理系统，能够理解复杂指令，自动执行任务，成为您工作和生活的得力助手。",
                    "meta_data": {"icon": "Cpu", "color": "from-tech-cyan to-blue-600"},
                    "sort_order": 2
                },
                {
                    "title": "隐私安全保障",
                    "content": "采用企业级加密技术，确保您的对话数据和个人信息绝对安全，让您无后顾之忧。",
                    "meta_data": {"icon": "Shield", "color": "from-bright-purple to-indigo-600"},
                    "sort_order": 3
                },
                {
                    "title": "超低延迟响应",
                    "content": "基于自研高性能推理引擎，实现毫秒级对话响应，让交流如同面对面般自然流畅。",
                    "meta_data": {"icon": "Zap", "color": "from-yellow-400 to-orange-500"},
                    "sort_order": 4
                }
            ]
            for f in features:
                create_content_item(db, ContentItemCreate(type="feature", **f))
            logger.info("Feature items initialized")

        # 4. Products
        if not get_product_by_slug(db, "reeftotem-ai"):
            p1 = ProductCreate(
                name="ReefTotem AI",
                slug="reeftotem-ai",
                short_desc="您的专属二次元 AI 伴侣",
                full_desc="ReefTotem AI 是我们旗舰级的虚拟伴侣产品，搭载最新的情感计算引擎。她不仅能理解您的语言，更能读懂您的情绪。支持全天候陪伴、日程管理、情感疏导等功能。",
                icon_url="",
                features=["情感记忆系统", "多模态交互 (语音/图像)", "个性化装扮", "跨平台同步"],
                sort_order=1,
                is_published=True
            )
            create_product(db, p1)
            logger.info("Product 'ReefTotem AI' created")

        if not get_product_by_slug(db, "openclaw"):
            p2 = ProductCreate(
                name="OpenClaw",
                slug="openclaw",
                short_desc="企业级智能 Agent 编排系统",
                full_desc="OpenClaw 专为企业打造，提供强大的自动化任务执行能力。无论是数据采集、报表生成，还是复杂的业务流程自动化，OpenClaw 都能轻松应对。",
                icon_url="",
                features=["可视化工作流编排", "丰富的插件生态", "企业级安全管控", "私有化部署支持"],
                sort_order=2,
                is_published=True
            )
            create_product(db, p2)
            logger.info("Product 'OpenClaw' created")

        if not get_product_by_slug(db, "reefquant"):
            p3 = ProductCreate(
                name="ReefQuant",
                slug="reefquant",
                short_desc="新一代量化交易终端",
                full_desc="结合 AI 预测能力的量化交易平台，为专业交易者提供毫秒级的回测与实盘交易服务。",
                icon_url="",
                features=["AI 因子挖掘", "超低延迟执行", "多市场支持", "Python/C++ 双接口"],
                sort_order=3,
                is_published=True
            )
            create_product(db, p3)
            logger.info("Product 'ReefQuant' created")

        # 5. Downloads
        # Check if we have downloads for ReefTotem AI
        p1_obj = get_product_by_slug(db, "reeftotem-ai")
        if p1_obj:
            existing_downloads = get_downloads(db, product_id=p1_obj.id)
            if not existing_downloads:
                d1 = DownloadItemCreate(
                    product_id=p1_obj.id,
                    name="ReefTotem Desktop",
                    version="1.2.0",
                    platform="Windows x64",
                    os_type=OSType.WINDOWS,
                    category="reeftotem",
                    package_url="https://example.com/downloads/reeftotem-setup-1.2.0.exe",
                    file_size="145 MB",
                    release_date=datetime(2026, 2, 20),
                    description="包含最新的情感引擎更新和冬季主题包。",
                    is_latest=True
                )
                create_download(db, d1)
                
                d2 = DownloadItemCreate(
                    product_id=p1_obj.id,
                    name="ReefTotem for Mac",
                    version="1.2.0",
                    platform="macOS (Apple Silicon)",
                    os_type=OSType.MAC,
                    category="reeftotem",
                    package_url="https://example.com/downloads/reeftotem-1.2.0-arm64.dmg",
                    file_size="138 MB",
                    release_date=datetime(2026, 2, 20),
                    is_latest=True
                )
                create_download(db, d2)
                logger.info("Downloads for ReefTotem initialized")

        # 6. About Us & Contact Us (New Content Types)
        # About Us - Team Members
        existing_team = get_content_items(db, type="team")
        if not existing_team:
            team_members = [
                {
                    "title": "Alex Chen",
                    "subtitle": "CEO & Founder",
                    "content": "前 Google AI 研究员，拥有 10 年人工智能领域经验，致力于让 AI 更有温度。",
                    "image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
                    "sort_order": 1
                },
                {
                    "title": "Sarah Li",
                    "subtitle": "CTO",
                    "content": "清华大学计算机博士，主攻自然语言处理与情感计算，ReefTotem 核心架构师。",
                    "image_url": "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=256",
                    "sort_order": 2
                },
                {
                    "title": "Mike Wang",
                    "subtitle": "Product Director",
                    "content": "资深产品经理，曾主导多款千万级用户 APP 的设计与迭代。",
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
                    "content": "期待与各行业伙伴建立合作关系，共创 AI 未来。",
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
                    "content": "寻找志同道合的你，一起探索人工智能的无限边界。",
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
                title="New Release 2.0",
                is_active=True
            ))
            logger.info("Hero badge initialized")

        # Hero Stats
        existing_hero_stats = get_content_items(db, type="hero_stat")
        if not existing_hero_stats:
            stats = [
                {"title": "活跃用户", "content": "100K+", "sort_order": 1},
                {"title": "智能响应", "content": "24/7", "sort_order": 2},
                {"title": "好评率", "content": "99%", "sort_order": 3}
            ]
            for s in stats:
                create_content_item(db, ContentItemCreate(type="hero_stat", **s))
            logger.info("Hero stats initialized")

        # Company Intro
        existing_company_intro = get_content_items(db, type="company_intro")
        if not existing_company_intro:
            create_content_item(db, ContentItemCreate(
                type="company_intro",
                title="关于 瑞孚图腾",
                subtitle="Shenzhen Qianhai ReefTotem Technology Co., Ltd.",
                content="深圳前海瑞孚图腾科技有限公司（ReefTotem）是一家专注于人工智能领域的创新科技公司。我们致力于将最前沿的 AI 技术转化为触手可及的智能产品。\n\n我们的团队由来自全球顶尖科技公司的工程师和设计师组成，怀揣着同一个愿景：让 AI 更有温度，让科技更懂人心。无论是二次元 AI 伴侣，还是高效的 Agent 服务，都是我们探索未来的足迹。",
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
                title="探索 无限可能",
                subtitle="融合前沿 AI 技术与极致交互设计，为您打造前所未有的智能体验",
                meta_data={"section": "product_showcase"},
                sort_order=1
            ))
            logger.info("Home section titles initialized")

        # Company Intro Stats
        existing_stats = get_content_items(db, type="stat")
        if not existing_stats:
            company_stats = [
                {"title": "成立年份", "content": "2026", "sort_order": 1},
                {"title": "服务全球", "content": "Global", "sort_order": 2},
                {"title": "核心专利", "content": "50+", "sort_order": 3}
            ]
            for s in company_stats:
                create_content_item(db, ContentItemCreate(type="stat", **s))
            logger.info("Company stats initialized")

        logger.info("Initial data created successfully")

    finally:
        db.close()

if __name__ == "__main__":
    init_db()
