import React from 'react';
import SiteConfigForm from './content/SiteConfigForm';
import ContentItemList from './content/ContentItemList';
import { AlertTriangle } from 'lucide-react';

const ContentView = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">内容管理</h2>
        <p className="text-muted-foreground">管理网站的全局配置和动态内容模块</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          当前模块已连接后台内容 API，但官网前台仍主要按静态发布内容渲染。这里保存的数据不会自动改写所有首页/产品页文案，必须等前台页面改成 API 驱动后才算完整 CMS 闭环。
        </div>
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
