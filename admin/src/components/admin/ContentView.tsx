import React from 'react';
import SiteConfigForm from './content/SiteConfigForm';
import ContentItemList from './content/ContentItemList';

const ContentView = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">内容管理</h2>
        <p className="text-muted-foreground">管理网站的全局配置和动态内容模块</p>
      </div>

      <div className="space-y-8">
        {/* Global Config */}
        <section>
          <SiteConfigForm />
        </section>

        {/* Dynamic Content Modules */}
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-foreground border-l-4 border-primary pl-3">
            首页内容管理
          </h3>
          
          <ContentItemList 
            type="hero_badge" 
            title="首页顶部标签 (Hero Badge)" 
          />

          <ContentItemList 
            type="hero_stat" 
            title="首页关键数据 (Hero Stats)" 
          />

          <ContentItemList 
            type="home_section_title" 
            title="首页版块标题 (Section Titles)" 
          />

          <ContentItemList 
            type="feature" 
            title="产品特性 (Features)" 
          />
          
          <ContentItemList 
            type="company_intro" 
            title="公司介绍 (Company Intro)" 
          />
          
          <ContentItemList 
            type="stat" 
            title="关于我们数据 (About Stats)" 
          />

          <ContentItemList 
            type="team" 
            title="团队成员 (About Us)" 
          />

          <ContentItemList 
            type="contact_method" 
            title="联系方式 (Contact Us)" 
          />
          
          {/* Future modules can be added here */}
          {/* <ContentItemList type="team" title="团队成员" /> */}
          {/* <ContentItemList type="milestone" title="发展历程" /> */}
        </section>
      </div>
    </div>
  );
};

export default ContentView;
