import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.content import get_config, update_config, get_content_items, update_content_item
from app.schemas.content import SiteConfigUpdate, ContentItemUpdate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_site_content():
    db = SessionLocal()
    try:
        # 1. Update Site Config (Banner)
        site_config = get_config(db, "site_info")
        if site_config:
            current_value = site_config.value
            current_value["banner"]["title"] = "ReefTotem AI 公司操作系统"
            current_value["banner"]["subtitle"] = "面向真实公司运营的 AI 员工协作与交付平台，覆盖公司创建、员工组织、项目立项、执行日志和交付审核。"
            current_value["banner"]["ctaText"] = "进入控制台"
            
            update_config(db, "site_info", SiteConfigUpdate(value=current_value))
            logger.info("Banner content updated")

        # 2. Update Hero Badge
        hero_badges = get_content_items(db, type="hero_badge")
        if hero_badges:
            update_content_item(db, hero_badges[0].id, ContentItemUpdate(title="Hermes Company OS"))
            logger.info("Hero badge updated")

        # 3. Update Hero Stats
        # We delete old ones and recreate to ensure order and content match, or just update if count matches
        hero_stats = get_content_items(db, type="hero_stat")
        new_hero_stats = [
            {"title": "首个验证公司", "content": "软件公司", "sort_order": 1},
            {"title": "核心链路", "content": "Issue/Run", "sort_order": 2},
            {"title": "交付审核", "content": "WorkProduct", "sort_order": 3}
        ]
        
        # Simple update logic: update first 3, create if missing
        for i, stat_data in enumerate(new_hero_stats):
            if i < len(hero_stats):
                update_content_item(db, hero_stats[i].id, ContentItemUpdate(**stat_data))
            # (Skipping creation for simplicity as we know they exist from previous step)
        logger.info("Hero stats updated")

        # 4. Update Company Intro
        company_intros = get_content_items(db, type="company_intro")
        if company_intros:
            intro_update = ContentItemUpdate(
                title="AI 公司运营平台",
                subtitle="Shenzhen Qianhai ReefTotem Technology Co., Ltd.",
                content="深圳前海瑞孚图腾科技有限公司（ReefTotem）正在建设面向真实公司运营的 AI 员工协作与交付平台。\n\n用户从 SaaS 账号进入，创建公司，安装公司包，招聘 AI 员工，提交项目目标，再通过 Issue、Run、日志和 WorkProduct 审核结果。\n\n软件开发公司是第一家验证公司，后续会复制到研究交付、运营服务、内容交付和安全检测等不同公司类型。"
            )
            update_content_item(db, company_intros[0].id, intro_update)
            logger.info("Company intro updated")

        # 5. Update Company Stats (About Stats)
        # Previously initialized as type="stat" in initial_data.py for "Company stats initialized"
        # We need to find the specific ones. 
        # In initial_data.py, we created 3 stats: 成立年份, 服务全球, 核心专利.
        # Let's fetch all stats and update them based on sort_order or just replace them.
        # To be safe, let's look for the ones we created.
        stats = get_content_items(db, type="stat")
        # Assuming the last 3 are the company stats or we can identify by sort_order if distinct?
        # In initial_data.py, features were 1-4, company stats were 1-3. 
        # Wait, if type is "stat", we might have mixed them?
        # Checking initial_data.py... features are type="feature". 
        # Company stats are type="stat".
        # Hero stats are type="hero_stat".
        # So all type="stat" are likely the company stats.
        
        new_company_stats = [
            {"title": "产品入口", "content": "opc", "sort_order": 1},
            {"title": "验证公司", "content": "ReefTotem", "sort_order": 2},
            {"title": "核心交付", "content": "WorkProduct", "sort_order": 3}
        ]
        
        for i, stat_data in enumerate(new_company_stats):
            if i < len(stats):
                update_content_item(db, stats[i].id, ContentItemUpdate(**stat_data))
        logger.info("Company stats updated")

    except Exception as e:
        logger.error(f"Error updating content: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_site_content()
