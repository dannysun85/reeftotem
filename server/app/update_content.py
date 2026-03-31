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
            current_value["banner"]["title"] = "赋予科技以灵魂 重塑数字生命"
            current_value["banner"]["subtitle"] = "ReefTotem 瑞孚图腾，以情感计算为核心，融合前沿 AI 大模型与极致交互美学。我们不仅创造工具，更创造能理解、会思考、有温度的智能伴侣。"
            current_value["banner"]["ctaText"] = "开启未来"
            
            update_config(db, "site_info", SiteConfigUpdate(value=current_value))
            logger.info("Banner content updated")

        # 2. Update Hero Badge
        hero_badges = get_content_items(db, type="hero_badge")
        if hero_badges:
            update_content_item(db, hero_badges[0].id, ContentItemUpdate(title="Future Intelligence 3.0"))
            logger.info("Hero badge updated")

        # 3. Update Hero Stats
        # We delete old ones and recreate to ensure order and content match, or just update if count matches
        hero_stats = get_content_items(db, type="hero_stat")
        new_hero_stats = [
            {"title": "情感交互", "content": "深度拟人", "sort_order": 1},
            {"title": "响应速度", "content": "毫秒级", "sort_order": 2},
            {"title": "用户信赖", "content": "Top 1%", "sort_order": 3}
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
                title="科技与艺术的 共鸣",
                subtitle="Shenzhen Qianhai ReefTotem Technology Co., Ltd.",
                content="深圳前海瑞孚图腾科技有限公司（ReefTotem）立足于中国最具活力的湾区核心，是一家致力于探索人工智能终极形态的先锋科技企业。\n\n我们坚信，未来的 AI 不应仅仅是冰冷的代码与算法，而应是具备情感感知与独立人格的数字生命。我们的设计理念源于对人性的深刻洞察，经营理念植根于技术创新与用户体验的极致追求。\n\n从底层大模型架构的自主研发，到二次元美学的细腻呈现，我们正在构建一个人机共生工的新世界。在这里，每一个像素都蕴含着温度，每一次交互都充满了灵性。"
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
            {"title": "研发占比", "content": "70%", "sort_order": 1},
            {"title": "自主专利", "content": "100+", "sort_order": 2},
            {"title": "服务全球", "content": "Global", "sort_order": 3}
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
