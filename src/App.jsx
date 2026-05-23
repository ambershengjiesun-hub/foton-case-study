import { useState, useEffect, useRef } from 'react'

// ==================== DATA ====================
const profileNav = [
  { id:'about', icon:'▎', label:'专业履历' },
  { id:'projects', icon:'▎', label:'核心项目' },
  { id:'skills', icon:'▎', label:'专业能力' },
]

const fotonNav = [
  { id:'story', icon:'▎', label:'Storyline 总览' },
  { id:'group-as-is', label:'AS IS', group:true },
  { id:'context', icon:'▎', label:'背景分析' },
  { id:'group-to-be', label:'TO BE', group:true },
  { id:'methodology', icon:'▎', label:'方法论' },
  { id:'system', icon:'▎', label:'体系搭建' },
  { id:'group-pilot', label:'PILOT', group:true },
  { id:'pilot', icon:'▎', label:'试点方案' },
  { id:'experience', icon:'▎', label:'经验印证' },
]

const projectDetails = [
  { id:'vw-icsd', title:'大众 ICSD 智能用户满意度数据平台重建', tags:'数据诊断 · LLM升级 · NLP', metric:'AI准确率 60% → 90%+', color:'border-l-brand-blue', client:'大众', bg2:'大众花了几百万开发舆情监测系统，但AI翻译用户抱怨时准确率仅60%，业务方不敢用。', problem:'AI把"刹车太硬"错误标注为"AEB功能故障"——前者是制动脚感，后者是ADAS功能。数据被分错部门，谁都用不了。', role:'我是项目驻场顾问，独立负责数据诊断和系统重建。', actions:['写SQL抽检几百条数据，验证AI翻译准确性','发现并定位"刹车硬→AEB故障"等典型错误模式','推动大模型从ChatGLM-6B升级到DeepSeek-V3 670B','引入SAE行业四级标签体系，重新映射所有功能类数据'], results:['准确率 60% → 90%+','季度报告被CTO主动要求分享，在最高技术例会上向各产品线SM负责人汇报','Q4报告引入四象限分析矩阵，支撑PPE/PPC新平台车型上市策略'] },
  { id:'vw-pq', title:'大众 智能座舱感知质量评测体系搭建', tags:'评测体系 · 语音交互 · 竞品对标', metric:'唤醒率 85% → 95%', color:'border-l-amber-500', client:'大众', bg2:'客户只有一张Excel指标清单，没有测试方法、评分标准或记录模板。研发在安静环境自测语音100%准确，但真实用户说"车机是智障"。', problem:'两个矛盾——不知道怎么测（无落地方法）；研发不认为有问题（自测数据完美）。', role:'独立负责语音交互、触控交互、AI三个核心模块。', actions:['研读C-SAE、C-ICAP等行业标准，将指标拆解为评测体系→测试用例→记录模板→计算方法四层结构','主导标准化测试设备选型和采购','设计7个真实驾驶场景（不同车速、噪音、车窗空调状态），配合100+条语料（含方言、英语、多轮对话）','在完全一致工况下对比小米SU7、小鹏G9等竞品'], results:['发现语音算法问题，推动某车型唤醒率 85% → 95%','评测体系成为大众上市前必检标准','竞品数据帮销售和市场部门理解新车竞争力'] },
  { id:'vw-ipd', title:'大众 IPD/FAW 场景化体验审查方案', tags:'方法创新 · 体验指标 · 流程设计', metric:'独创双通道测试法', color:'border-l-violet-500', client:'大众', bg2:'200+项工程指标涌入，团队只有5人/1周。同事私下吐槽传统测试脱离用户场景。', problem:'无线充电的工程指标"手机放上能充电"就达标，但用户感受是"充10分钟涨1%还烫手"。指标达标≠体验达标。', role:'独立提出方法论，独立设计方案。', actions:['将IPD和FAW两套200+项指标逐项映射，建立飞书多维表格知识库','独创"双通道测试法"：主通道用三个行为问题（犹豫？想重复？想放弃？）快速定位痛点；辅通道仅对评分≤2分的步骤回溯工程指标'], results:['方案向客户汇报后被评价"开拓了新的思路"','决定在下一个IPD开发周期中试运行'] },
  { id:'bmw-cd', title:'宝马 互联驾驶功能用户体验提升', tags:'数据整合 · 用户画像 · 多源分析', metric:'触达数十万级用户', color:'border-l-emerald-500', client:'宝马', bg2:'宝马互联驾驶团队需要评估语音、音乐、数字钥匙三大功能的体验问题，支撑下一代产品规划。但没有新增调研预算。', problem:'没预算做新调研，但企业内散落着大量已有数据——车机埋点、客服记录、经销商反馈、APP问卷，只是没人整合。', role:'独立负责数据整合和分析。', actions:['整合CCA车机埋点（ID7 DAU 26万+、ID8 DAU 2.7万）+ 463通CIC客服访谈 + 两轮经销商实地走访 + 590份APP问卷','发现方言区识别率显著偏低','发现互联音乐流失主因是CarPlay替代效应','发现数字钥匙知晓率99%，但完全依赖者仅8%；47%的人仍习惯传统钥匙'], results:['语音改进建议纳入版本规划，触达数十万级活跃用户','音乐和数字钥匙建议被采纳用于下一代产品定义'] },
  { id:'bmw-hu', title:'宝马 HU导航产品对标研究', tags:'定量研究 · 焦点小组 · 竞品分析', metric:'功能数≠体验', color:'border-l-orange-500', client:'宝马', bg2:'宝马想知道自家导航和竞品的真实体验差距，不只是功能数量，更关键的是用户感受。', problem:'宝马导航有84个功能，同级别最多之一。但功能多=体验好？需要直接从用户那里听到答案。', role:'负责用户研究部分（定量问卷+焦点小组）。', actions:['定量问卷回收500份有效样本','焦点小组5组20位车主（每组含小鹏、蔚来、理想、特斯拉车主各1位）','发现"功能多≠体验好"：宝马84个功能，惊喜时刻仅3.6%，失望时刻15.5%；小鹏79个功能，惊喜时刻27.8%，失望时刻0%'], results:['策略建议被采纳用于下一代导航产品定义'] },
  { id:'audi-ota', title:'奥迪 OTA 推送统筹', tags:'项目管理 · OTA · 竞品追踪', metric:'140万辆/10个月', color:'border-l-gray-500', client:'奥迪', bg2:'奥迪中国需要向全国百万级车主推送OTA升级，涉及德国供应商和中国南北合资公司多个协作方。', problem:'推送节奏、用户沟通、成功率监控等环节缺乏统一协调。', role:'负责推送计划制定与执行追踪、竞品OTA市场调研、车主问卷设计分析。', actions:['制定推送计划，协调德国供应商按周执行','每周追踪下载率和安装成功率，动态调整推送波次','持续跟踪12家竞品OTA动态，输出月度/季度分析报告','设计并回收618份有效车主问卷'], results:['10个月内统筹约140万辆目标车辆推送计划','安装成功率最高接近100%','洞察被采纳用于后续推送策略优化'] },
]

const lifecycleStages = [
  { key:'define', num:'01', title:'需求定义', items:['用户画像细分（长途/城配/冷链/绿通/货拉拉）','场景化需求拆解与跟车调研','竞品策略分析'] },
  { key:'develop', num:'02', title:'开发测试', items:['商用车特有场景：装载、卸货、夜间驾驶','按用户旅程进行可用性测试','快速发现 UI/UE 问题'] },
  { key:'evaluate', num:'03', title:'上市前评测', items:['对标比亚迪/吉利/解放/重汽','感知交互、服务互联、AI 多维度评测','输出竞争力报告与改进建议'] },
  { key:'track', num:'04', title:'上市后追踪', items:['舆情抓取（卡车之家/运满满/抖音/快手）','T-Box 实时回传数据整合','售后/客服 + 问卷/跟车访谈验证'] },
  { key:'feedback', num:'05', title:'数据反哺', items:['真实使用数据指导下一代车型定义','"一代产品一代数据"持续迭代','用户画像与标签体系不断更新'] },
]

const expTabs = [
  { id:'exp1', label:'趋势研究', color:'border-l-brand-blue', badge:'text-brand-blue', title:'行业趋势与用户需求研究', subtitle:'← 大众 VOC 平台 + 宝马数据整合', left:['大众 ICSD · VOC平台重建',['20+数据源整合（车质网/懂车帝/小红书等）','LLM自动打标 + 情绪分析 + SAE四级标签','AI准确率 60% → 90%+','季度报告CTO主动要求在全技术例会分享']], right:['宝马互联驾驶 · 多源整合',['车机埋点（DAU 26万+）+463通客服+经销商+590份问卷','发现方言区识别率低、CarPlay替代效应','洞察触达数十万级活跃用户']] },
  { id:'exp2', label:'方法论', color:'border-l-amber-500', badge:'text-amber-400', title:'方法论建设与优化', subtitle:'← VW PQ 评测体系 + IPD 双通道测试法', left:['大众 PQ · 感知质量评测体系',['四层架构：体系→用例→模板→算法','7个场景+100+语料（含方言/英语）','唤醒率 85% → 95%','成为上市前必检标准']], right:['大众 IPD · 双通道测试法',['主通道：3个行为问题快速定位痛点','辅通道：仅对低分步骤回溯指标','解决200+指标 vs 5人/1周矛盾','客户评价"开拓了新的思路"']] },
  { id:'exp3', label:'数据中台', color:'border-l-violet-500', badge:'text-violet-400', title:'数据中台与工具体系建设', subtitle:'← VW ICSD 技术升级', left:['LLM升级与标签体系',['推动 ChatGLM-6B → DeepSeek-V3 670B','引入SAE四级标签体系，重映射全部数据','Q4引入四象限分析矩阵','支撑PPE/PPC新平台上市策略']], right:['从数据到决策',['从"业务方不敢用"到"CTO主动分享"','最高技术例会向各产品线SM汇报','核心理念：分析前先验证数据可信度']] },
  { id:'exp4', label:'画像应用', color:'border-l-emerald-500', badge:'text-emerald-400', title:'数据与用户画像应用', subtitle:'← 宝马用户行为洞察 + HU导航对标', left:['宝马数字钥匙洞察',['多源交叉分析：知晓率99%','完全依赖仅8%，47%习惯传统钥匙','画像直接驱动产品策略']], right:['宝马 HU 导航对标',['500份问卷+5组焦点小组20位车主','84功能惊喜时刻仅3.6%','建议被采纳用于下一代产品定义']] },
  { id:'exp5', label:'统筹落地', color:'border-l-gray-500', badge:'text-gray-400', title:'大型项目统筹与跨部门落地', subtitle:'← 奥迪 OTA 统筹 + 埃森哲 5年顾问经验', single:['10个月统筹约140万辆OTA推送，安装成功率峰值近100%','协调德国供应商+中国南北合资公司，每周追踪、动态调整','PMP认证 + 5年+驻场顾问，善于在大型组织中推动洞察落地为决策'] },
]

// ==================== MAIN APP ====================
export default function App() {
  const [mainTab, setMainTab] = useState('profile')
  const [panel, setPanel] = useState('about')
  const contentRef = useRef(null)

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0 }, [panel, mainTab])

  const nav = mainTab === 'profile' ? profileNav : fotonNav

  const switchTab = (tab) => {
    setMainTab(tab)
    setPanel(tab === 'profile' ? 'about' : 'story')
  }

  const navigateTo = (panelId) => {
    if (mainTab !== 'foton') setMainTab('foton')
    setPanel(panelId)
  }

  return (
    <div className="h-screen flex flex-col bg-surface-950 text-white">
      <header className="bg-surface-950/80 backdrop-blur border-b border-gray-800 shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white">孙胜洁</span>
            <span className="text-xs text-gray-400 ml-2">北汽福田 · Case Study</span>
          </div>
          <div className="flex gap-6">
            {[
              ['profile','关于我'],
              ['foton','Case Study']
            ].map(([key,label]) => (
              <button key={key} onClick={() => switchTab(key)}
                className={`text-base font-semibold pb-1 transition-colors ${mainTab === key ? 'text-white border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-300'}`}>{label}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Case Study sub-nav */}
      {mainTab === 'foton' && (
        <div className="bg-surface-900 border-b border-gray-800 shrink-0">
          <div className="max-w-4xl mx-auto px-6 py-1.5 flex items-center justify-center gap-6 text-xs">
            <button onClick={() => setPanel('story')} className={`transition-colors ${panel === 'story' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>Storyline</button>
            <span className="text-gray-700">|</span>
            {[
              ['AS IS', ['context'], 'text-red-400'],
              ['TO BE', ['methodology','system'], 'text-brand-blue-light'],
              ['PILOT', ['pilot','experience'], 'text-emerald-400'],
            ].map(([label, pages, color]) => {
              const active = pages.includes(panel)
              return (
                <span key={label} className="flex items-center gap-3">
                  <button onClick={() => setPanel(pages[0])}
                    className={`uppercase tracking-widest font-bold transition-colors ${active ? color : 'text-gray-600 hover:text-gray-400'}`}>
                    {label}
                  </button>
                  {label !== 'PILOT' && <span className="text-gray-700">·</span>}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-surface-950 border-r border-gray-800 shrink-0 hidden md:flex flex-col overflow-y-auto">
          <nav className="flex-1 py-4 space-y-0.5 px-2">
            {nav.map(item => (
              item.group ? (
                <div key={item.id} className="text-xs text-gray-500 uppercase tracking-widest pt-3 pb-1 px-3 font-medium">{item.label}</div>
              ) : (
                <div key={item.id} onClick={() => setPanel(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${panel === item.id ? 'bg-white/5 text-white border-l-[3px] border-brand-blue' : 'text-gray-300 hover:bg-white/5'}`}>
                  <span>{item.icon}</span> {item.label}
                </div>
              )
            ))}
          </nav>
        </aside>

        <main ref={contentRef} className="flex-1 overflow-y-auto">
          <div key={mainTab + panel} className="animate-fadeIn">
            {mainTab === 'profile'
              ? <ProfilePanel panel={panel} />
              : <FotonPanel panel={panel} onNavigate={navigateTo} />}
          </div>
        </main>
      </div>
    </div>
  )
}

// ==================== PROFILE ====================
function ProfilePanel({ panel }) {
  switch(panel) {
    case 'about': return <About />;
    case 'projects': return <Projects />;
    case 'skills': return <Skills />;
    default: return <About />;
  }
}

const Section = ({ children }) => <div className="max-w-3xl mx-auto px-[3vw] py-[3vh]">{children}</div>

function About() { return (
  <Section>
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-3">孙胜洁<span className="text-gray-400 text-xl font-normal ml-2">Amber Sun</span></h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {['高级用户研究专家','6年+汽车智能座舱','埃森哲资深顾问'].map(t => (
          <span key={t} className="inline-block px-3 py-1 text-xs rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">{t}</span>
        ))}
      </div>
      <p className="text-lg text-gray-300 max-w-xl">在复杂的汽车产品和真实的用户需求之间找到结合点。</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[{v:'6+',l:'年智能座舱经验'},{v:'6',l:'个核心项目'},{v:'5',l:'项能力模块'},{v:'3',l:'语言（中/英/法）'}].map(s => (
        <div key={s.l} className="bg-surface-900/50 border border-gray-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-bold">{s.v}</div><div className="text-xs text-gray-400 mt-1">{s.l}</div>
        </div>
      ))}
    </div>
    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">专业履历</h3>
    <div className="space-y-4 mb-8">
      {[
        { d:'2020.02 – 至今', t:'埃森哲（中国）· 资深咨询顾问 / 用户研究专家', s:'驻场服务大众、宝马、奥迪等德系车企，负责智能座舱用户研究、数据诊断、评测体系搭建和产品策略。' },
        { d:'2018.07 – 2020.02', t:'北京睿拓时创 · 应用工程师（科研与方案设计）', s:'' },
        { d:'2015 – 2018', t:'中国民航大学 · 航空工程硕士', s:'法国CTI认证工程师学衔（Top 30%）· 国家奖学金 · 3篇论文（SCI二区/EI/中文核心）' },
      ].map((e,i) => (
        <div key={i} className="flex gap-4">
          <div className="w-px bg-gray-700 shrink-0" />
          <div><div className="text-sm text-gray-400">{e.d}</div><div className="font-semibold text-white">{e.t}</div>{e.s && <div className="text-sm text-gray-300 mt-1">{e.s}</div>}</div>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
      <span>sunshengjie_ambre@163.com</span><span className="text-gray-700">|</span><span>15022658276</span><span className="text-gray-700">|</span><span>PMP 认证</span><span className="text-gray-700">|</span><span>TOEIC 855 / DELF B2</span>
    </div>
  </Section>
)}

function Projects() {
  const [expanded, setExpanded] = useState(null)
  const detail = expanded ? projectDetails.find(p => p.id === expanded) : null

  return (
  <div className="max-w-5xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col">
    <h2 className="text-4xl font-bold tracking-tight mb-6 shrink-0">核心项目</h2>
    <div className="flex-1 flex gap-6 min-h-0">
      <div className={`grid grid-cols-2 grid-rows-3 gap-3 ${detail ? 'w-[48%]' : 'w-full'} transition-all shrink-0 content-start`}>
        {projectDetails.map(p => (
          <div key={p.id} onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            className={`bg-surface-900 border rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${expanded ? (expanded === p.id ? `ring-2 ring-brand-blue/40 opacity-100 border-2 ${p.color}` : 'opacity-40 hover:opacity-60') : 'hover:border-gray-500'} ${expanded ? '' : 'border-gray-700'} ${p.color} border-l-2`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold ${p.id==='vw-icsd'?'text-brand-blue-light':p.id==='vw-pq'?'text-amber-400':p.id==='vw-ipd'?'text-violet-400':p.id==='bmw-cd'?'text-emerald-400':p.id==='bmw-hu'?'text-orange-400':'text-gray-400'}`}>{p.client}</span>
              {expanded === p.id && <span className="text-brand-blue text-lg font-bold">▸</span>}
            </div>
            <div className="font-semibold text-white text-sm leading-tight mb-1.5">{p.title}</div>
            <div className="text-xs text-brand-blue-light font-medium">{p.metric}</div>
          </div>
        ))}
      </div>

      {detail && (
        <div className={`flex-1 bg-surface-900 border border-gray-800 rounded-xl overflow-hidden min-w-0 animate-fadeIn flex flex-col`} style={{ borderLeftWidth:'3px', borderLeftColor: detail.id==='vw-icsd'?'#6DB8F0':detail.id==='vw-pq'?'#f59e0b':detail.id==='vw-ipd'?'#8b5cf6':detail.id==='bmw-cd'?'#10b981':detail.id==='bmw-hu'?'#f97316':'#6b7280' }}>
          <div className="bg-surface-800/50 border-b border-gray-700 px-6 py-2.5 flex items-center justify-between shrink-0" style={{ borderTopWidth:'3px', borderTopColor: detail.id==='vw-icsd'?'#6DB8F0':detail.id==='vw-pq'?'#f59e0b':detail.id==='vw-ipd'?'#8b5cf6':detail.id==='bmw-cd'?'#10b981':detail.id==='bmw-hu'?'#f97316':'#6b7280' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">项目详情</span>
              <span className="text-xs text-gray-600">{detail.client}</span>
            </div>
            <button onClick={() => setExpanded(null)} className="text-gray-400 hover:text-white text-lg">&times;</button>
          </div>
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{detail.title}</h3>

            <div className="space-y-3.5 text-sm">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">背景</div>
              <p className="text-gray-200 leading-relaxed">{detail.bg2}</p>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">问题</div>
              <p className="text-gray-200 leading-relaxed">{detail.problem}</p>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">我的角色</div>
              <p className="text-gray-200 leading-relaxed">{detail.role}</p>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">行动</div>
              <ul className="space-y-1.5">{detail.actions.map((a,i) => <li key={i} className="text-gray-200 flex gap-2"><span className="text-brand-blue shrink-0">·</span>{a}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">成果</div>
              <ul className="space-y-1.5">{detail.results.map((r,i) => <li key={i} className="text-emerald-400 flex gap-2"><span>·</span>{r}</li>)}</ul>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

function Skills() { return (
  <Section>
    <h2 className="text-4xl font-bold tracking-tight mb-8">专业能力</h2>
    <div className="space-y-2.5">
      {[
        { t:'用户研究', d:'定性与定量研究方法的系统化运用', accent:'border-l-brand-blue', tags:'深度访谈 · 焦点小组 · 可用性测试 · 问卷设计与抽样 · NPS建模 · KANO模型 · 用户画像构建' },
        { t:'数据分析', d:'从数据提取到洞察可视化的全链路', accent:'border-l-emerald-500', tags:'SQL数据提取与清洗 · Power BI可视化看板 · 大模型文本挖掘与情感分析' },
        { t:'行业标准', d:'智能座舱评测标准的深度应用', accent:'border-l-amber-500', tags:'C-SAE · C-ICAP 智能座舱感知质量评测标准' },
        { t:'项目管理', d:'跨国、跨部门的复杂项目统筹', accent:'border-l-violet-500', tags:'PMP认证 · 跨国跨部门协调经验' },
        { t:'语言', d:'多语种工作环境', accent:'border-l-orange-500', tags:'英语商务流利（TOEIC 855） · 法语工作水平（DELF B2 / TEF B2）' },
      ].map(sk => (
        <div key={sk.t} className={`bg-surface-900 border border-gray-800 rounded-xl p-3.5 ${sk.accent} border-l-2 hover:border-gray-600 transition-colors`}>
          <div className="text-sm font-bold text-white mb-0.5">{sk.t}</div>
          <div className="text-xs text-gray-400 mb-2">{sk.d}</div>
          <div className="flex flex-wrap gap-1.5">
            {sk.tags.split('·').map((s,i) => <span key={i} className="inline-block px-2.5 py-1 text-xs rounded-full bg-surface-950 text-gray-400 border border-gray-700">{s.trim()}</span>)}
          </div>
        </div>
      ))}
    </div>
  </Section>
)}

// ==================== FOTON ====================
function FotonPanel({ panel, onNavigate }) {
  const back = () => onNavigate('story')
  switch(panel) {
    case 'story': return <Storyline onNavigate={onNavigate} />;
    case 'context': return <Context onBack={back} />;
    case 'methodology': return <Methodology onBack={back} />;
    case 'system': return <System onBack={back} />;
    case 'experience': return <Experience onBack={back} />;
    case 'pilot': return <Pilot onBack={back} />;
    default: return <Storyline onNavigate={onNavigate} />;
  }
}

function Title({ label, title, onBack }) { return <div className="flex items-center gap-3 mb-4"><span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">{label}</span><h2 className="text-3xl font-bold">{title}</h2>{onBack && <button onClick={onBack} className="ml-auto text-xs text-gray-500 hover:text-brand-blue-light transition-colors border border-gray-700 rounded-full px-3 py-1">← Storyline</button>}</div> }

// --- STORYLINE ---
function Storyline({ onNavigate }) { return (
  <div className="max-w-4xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
    <h2 className="text-4xl font-bold tracking-tight mb-8">Case Study</h2>

    <div className="space-y-4">
      {/* AS IS */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-3 flex items-center gap-5 h-[88px]">
        <div className="shrink-0 flex flex-col items-center w-14">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-1">
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#f87171" strokeWidth="1.5"/><line x1="10" y1="5" x2="10" y2="11" stroke="#f87171" strokeWidth="1.5"/><circle cx="10" cy="14" r="0.8" fill="#f87171"/></svg>
          </div>
          <span className="text-xs font-bold text-red-400 tracking-widest">AS IS</span>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 h-full">
          {[['竞争升级','比亚迪·吉利入局'],['用户跃迁','乘用车体验期望'],['品牌向上','从工具到品牌']].map(([t,s]) => (
            <div key={t} onClick={() => onNavigate('context')} className="bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:border-red-400/50 transition-colors text-center flex flex-col justify-center h-full">
              <div className="text-white font-bold text-sm whitespace-nowrap">{t}</div><div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center py-1">
        <span className="text-gray-700 text-sm">↓</span>
      </div>

      {/* TO BE */}
      <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/[0.04] px-5 py-3 flex items-center gap-5 h-[88px]">
        <div className="shrink-0 flex flex-col items-center w-14">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center mb-1">
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#6DB8F0" strokeWidth="1.5"/><circle cx="10" cy="10" r="3" fill="none" stroke="#6DB8F0" strokeWidth="1.5"/><line x1="10" y1="2" x2="10" y2="5" stroke="#6DB8F0" strokeWidth="1.5"/></svg>
          </div>
          <span className="text-xs font-bold text-brand-blue-light tracking-widest">TO BE</span>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-3 h-full">
          {[
            ['全生命周期闭环','定义→开发→评测→追踪','methodology'],
            ['大数据+小数据','双引擎驱动洞察','methodology'],
            ['平台架构','数据→分析→应用','system'],
            ['用户画像矩阵','5类商用车群体','system'],
          ].map(([t,s,to]) => (
            <div key={t} onClick={() => onNavigate(to)} className="bg-surface-900 border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-brand-blue/50 transition-colors text-center flex flex-col justify-center h-full">
              <div className="text-white font-bold text-sm whitespace-nowrap">{t}</div><div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center py-1">
        <span className="text-gray-700 text-sm">↓</span>
      </div>

      {/* Pilot */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-3 flex items-center gap-5 h-[88px]">
        <div className="shrink-0 flex flex-col items-center w-14">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-1">
            <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 18,10 14,10 14,17 6,17 6,10 2,10" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-xs font-bold text-emerald-400 tracking-widest">PILOT</span>
        </div>
        <div className="flex-1 h-full">
          <div onClick={() => onNavigate('pilot')} className="bg-surface-900 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:border-emerald-400/50 transition-colors text-center flex flex-col justify-center h-full">
            <div className="text-white font-bold text-sm">欧曼银河试点</div>
            <div className="text-xs text-gray-400 mt-0.5">从数据整合到看板上线，跑通最小闭环</div>
          </div>
        </div>
      </div>
    </div>

  </div>
)}

// --- CONTEXT ---
function Context({ onBack }) { return (
  <div className="max-w-4xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
    <Title label="AS IS" title="背景分析" onBack={onBack} />
    <div className="grid grid-cols-4 gap-3 mb-5">
      {[{v:'65万辆',l:'2025总销量',c:'+5.85%'},{v:'17%',l:'市占率',c:'+1.6ppt'},{v:'14.2万辆',l:'重卡',c:'+103.6%'},{v:'10.1万辆',l:'新能源',c:'+87%'}].map(m => (
        <div key={m.l} className="bg-surface-900/50 border border-gray-800 rounded-xl p-4 text-center"><div className="text-xs text-gray-400">{m.l}</div><div className="text-2xl font-bold mt-1">{m.v}</div><div className="text-xs text-emerald-400 mt-1">{m.c}</div></div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-4 mb-5">
      {[{c:'border-t-red-500',t:'竞争维度升级',d:'比亚迪、吉利等乘用车巨头带着用户思维进入商用车'},{c:'border-t-amber-500',t:'用户期望跃迁',d:'司机受乘用车智舱/智驾影响，对舒适性、智能化要求全面提升'},{c:'border-t-brand-blue',t:'品牌向上攻坚',d:'欧曼银河产品力到位，品牌感知需要消费者洞察驱动'}].map(ch => (
        <div key={ch.t} className={`bg-surface-900 border border-gray-800 rounded-xl p-3.5 border-t-2 ${ch.c}`}><div className="font-bold text-sm mb-1.5">{ch.t}</div><p className="text-xs text-gray-300 leading-relaxed">{ch.d}</p></div>
      ))}
    </div>
    <div className="bg-surface-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
      <table className="w-full text-sm"><thead><tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider"><th className="text-left py-2 px-4">产品线</th><th className="text-left py-2 px-4">定位</th><th className="text-left py-2 px-4">动力</th><th className="text-left py-2 px-4">场景</th><th className="text-left py-2 px-4">亮点</th></tr></thead>
      <tbody className="divide-y divide-gray-700">
        {[{n:'银河 9',p:'旗舰',c:'text-brand-blue-light',d:'混动/纯电/燃油',s:'干线物流、快递快运',h:'综合1000+马力'},{n:'银河 5/5M',p:'走量',c:'text-amber-400',d:'混动/燃油',s:'煤炭砂石、港口、城际',h:'比行业轻400kg'},{n:'银河 3/T',p:'入门/特种',c:'text-gray-400',d:'燃油/电动',s:'中短途支线/工程渣土',h:'B10寿命160万km'}].map(r => (
          <tr key={r.n} className="hover:bg-white/[0.03]"><td className="py-2 px-4 font-semibold text-white text-xs">{r.n}</td><td className={`py-2 px-4 text-xs ${r.c}`}>{r.p}</td><td className="py-2 px-4 text-xs text-gray-300">{r.d}</td><td className="py-2 px-4 text-xs text-gray-300">{r.s}</td><td className="py-2 px-4 text-xs text-gray-300">{r.h}</td></tr>
        ))}
      </tbody></table>
    </div>
    <div className="border border-brand-blue/10 bg-brand-blue/[0.03] rounded-xl p-4">
      <p className="text-sm text-gray-300 leading-relaxed">
        💡 本方案以<span className="text-white font-medium">欧曼银河重卡</span>为核心分析对象——高端旗舰、品牌向上主战场、车联网数据基础好、用户触点多，最适合跑通消费者洞察闭环。
      </p>
    </div>
  </div>
)}

// --- METHODOLOGY (Lifecycle + Method combined) ---
function Methodology({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
      <Title label="TO BE" title="方法论" onBack={onBack} />

      {/* Lifecycle - self-contained stages */}
      <div className="bg-surface-900 border border-gray-800 rounded-xl p-4 mb-5">
        <h3 className="text-sm font-bold text-white mb-4">整车全生命周期洞察闭环</h3>
        <div className="grid grid-cols-5 gap-3 mb-3">
          {lifecycleStages.map((s, i) => (
            <div key={s.key} className="bg-surface-950 border border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-white bg-brand-blue/20 w-5 h-5 rounded flex items-center justify-center shrink-0">{s.num}</span>
                <span className="font-bold text-xs text-white">{s.title}</span>
              </div>
              <ul className="space-y-1">
                {s.items.map((item, j) => (
                  <li key={j} className="text-xs text-gray-400 flex gap-1.5"><span className="text-gray-600 shrink-0">·</span>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Loop indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <span className="text-xs text-brand-blue-light whitespace-nowrap">数据反哺 → 下一代车型需求定义</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
      </div>

      {/* Big + Small Data - all in one view */}
      <div className="bg-surface-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-4">大数据 + 小数据 双引擎</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-950 border border-gray-700 rounded-lg p-4">
            <div className="text-sm font-bold mb-3 text-brand-blue-light">大数据引擎</div>
            <div className="space-y-2 text-xs">
              {[['来源','舆情抓取、T-Box、客服日志、CRM'],['回答','什么问题？多少人？在哪？趋势？'],['工具','LLM标注、情感分析、聚类算法'],['产出','趋势监控、问题预警、用户分群、标签聚类']].map(([k,v]) => (
                <div key={k} className="flex gap-2"><span className="text-brand-blue shrink-0 w-8">{k}</span><span className="text-gray-400">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-surface-950 border border-gray-700 rounded-lg p-4">
            <div className="text-sm font-bold mb-3 text-amber-400">小数据引擎</div>
            <div className="space-y-2 text-xs">
              {[['来源','跟车访谈、焦点小组、可用性测试'],['回答','为什么？司机怎么想？根因？'],['工具','语义提取、行为编码分析'],['产出','根因分析、体验洞察、需求验证']].map(([k,v]) => (
                <div key={k} className="flex gap-2"><span className="text-amber-400 shrink-0 w-8">{k}</span><span className="text-gray-400">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
        {/* Case example */}
        <div className="bg-surface-950 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">应用案例：欧曼银河空调投诉分析</div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-block px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shrink-0">大数据</span>
            <span className="text-gray-300">广东区域投诉两周环比 ↑ <span className="text-red-400 font-bold">42%</span></span>
            <span className="text-gray-600">→</span>
            <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">小数据</span>
            <span className="text-gray-300">5-8位司机跟车访谈 + 实车测试</span>
            <span className="text-gray-600">→</span>
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">根因</span>
            <span className="text-gray-300">散热面积不足，华南工况超出设计边界</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SYSTEM (Platform + Profiles combined) ---
function System({ onBack }) { return (
  <div className="max-w-6xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
    <Title label="TO BE" title="体系搭建" onBack={onBack} />
    <p className="text-gray-400 text-xs mb-5">以上方法论在福田全产品线的落地载体——数据平台为底座，用户画像为产出，支撑从重卡到轻卡的消费者洞察需求。后续试点以欧曼银河为切入点验证。</p>

    <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
      {/* Left: Platform */}
      <div className="bg-surface-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">数据平台架构</h3>
        <p className="text-xs text-gray-500 mb-4">整合多源数据 → AI驱动分析 → 业务决策看板</p>
        <div className="space-y-2">
          <div className="bg-surface-950 border border-brand-blue/10 rounded-lg p-3">
            <div className="text-xs font-bold text-brand-blue-light mb-1.5">应用层 · 业务决策看板</div>
            <div className="flex flex-wrap gap-1.5">{['舆情总览','竞品动态','用户画像','问题追踪','上市健康度'].map(t => <span key={t} className="inline-block px-2 py-0.5 text-xs rounded bg-surface-800 text-gray-300 border border-gray-600">{t}</span>)}</div>
          </div>
          <div className="text-center text-gray-600 text-xs">↑</div>
          <div className="bg-surface-950 border border-gray-700 rounded-lg p-3">
            <div className="text-xs font-bold text-gray-200 mb-1.5">分析层 · AI驱动的洞察引擎</div>
            <div className="flex flex-wrap gap-1.5">{['LLM自动标注与打标','情感分析','聚类分群','趋势预测'].map(t => <span key={t} className="inline-block px-2 py-0.5 text-xs rounded bg-surface-800 text-gray-400 border border-gray-600">{t}</span>)}</div>
          </div>
          <div className="text-center text-gray-600 text-xs">↑</div>
          <div className="bg-surface-950 border border-gray-700 rounded-lg p-3">
            <div className="text-xs font-bold text-gray-200 mb-1.5">数据层 · 多源数据整合</div>
            <div className="flex flex-wrap gap-1.5">{['三方舆情','车联网 T-Box','售后/客服','销售 CRM','调研数据'].map(t => <span key={t} className="inline-block px-2 py-0.5 text-xs rounded bg-surface-800 text-gray-400 border border-gray-600">{t}</span>)}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 text-center">
          核心理念：先验证数据可信度，从最痛点切入，工具解放人力
        </div>
      </div>

      {/* Connector */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-xs text-gray-500 whitespace-nowrap">数据</div>
        <div className="w-0.5 h-8 bg-gray-600" />
        <span className="text-xs text-brand-blue-light whitespace-nowrap">驱动</span>
        <div className="w-0.5 h-8 bg-gray-600" />
        <div className="text-xs text-gray-500 whitespace-nowrap">画像</div>
      </div>

      {/* Right: Profiles */}
      <div className="bg-surface-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">商用车用户画像矩阵</h3>
        <p className="text-xs text-gray-500 mb-4">画像驱动精准营销、产品迭代、服务设计</p>
        <div className="space-y-2">
          {[
            ['长途物流','银河9','跨省干线·月1.5万km+','TCO、油耗、卧铺舒适','车联网+社群','border-l-brand-blue'],
            ['城配快递','轻卡·4米2','市内短途·日100km+','装载、油耗、充电','接单平台+访谈','border-l-amber-500'],
            ['冷链运输','冷藏/重卡','温控要求·时效压力','冷机可靠性、故障响应','车联网+货主反馈','border-l-emerald-500'],
            ['绿通/生鲜','重卡/轻卡','时效优先·免通行费','出勤率、载重合规','高速数据+社群','border-l-violet-500'],
            ['货拉拉/平台','轻卡/VAN','灵活接单·多场景','购车成本、残值','平台数据+访谈','border-l-orange-500'],
          ].map(([g,c,s,p,d,cl]) => (
            <div key={g} className={`bg-surface-950 border border-gray-700 rounded-lg p-2.5 ${cl} border-l-2`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white">{g}</span>
                <span className="text-xs text-gray-500">{c}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>{s}</span><span className="text-gray-600">|</span><span>{p}</span><span className="text-gray-600">|</span><span className="text-gray-500">{d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

// --- EXPERIENCE ---
function Experience({ onBack }) { return (
  <div className="max-w-4xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
    <Title label="PILOT" title="过往项目经验印证" onBack={onBack} />
    <p className="text-gray-400 text-xs mb-5">6年乘用车经验（大众/宝马/奥迪），底层方法论可迁移至商用车场景。</p>
    <div className="grid grid-cols-2 gap-3">
      {expTabs.filter(e => e.id !== 'exp5').map(e => (
        <div key={e.id} className={`bg-surface-900 border border-gray-800 rounded-xl p-4 border-l-2 ${e.color}`}>
          <div className={`text-xs ${e.badge} font-medium mb-1`}>{e.title}</div>
          <div className="text-xs text-gray-400 mb-2">{e.subtitle}</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-semibold text-white mb-1">{e.left[0]}</div>
              <ul className="space-y-0.5 text-gray-400">{e.left[1].map((s,i) => <li key={i}>· {s}</li>)}</ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">{e.right[0]}</div>
              <ul className="space-y-0.5 text-gray-400">{e.right[1].map((s,i) => <li key={i}>· {s}</li>)}</ul>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Exp5: standalone */}
    {(() => { const e = expTabs.find(x => x.id === 'exp5'); return (
      <div key={e.id} className={`mt-4 bg-surface-900 border border-gray-800 rounded-xl p-4 border-l-2 ${e.color}`}>
        <div className={`text-xs ${e.badge} font-medium mb-1`}>{e.title}</div>
        <div className="text-xs text-gray-400 mb-2">{e.subtitle}</div>
        <div className="text-xs text-gray-400 space-y-0.5">{e.single.map((s,i) => <p key={i}>· {s}</p>)}</div>
      </div>
    )})()}

  </div>
)}

// --- PILOT ---
function Pilot({ onBack }) { return (
  <div className="max-w-4xl mx-auto px-[3vw] py-[2.5vh] h-full flex flex-col justify-center">
    <Title label="PILOT" title="试点方案：欧曼银河消费者洞察闭环" onBack={onBack} />

    <div className="space-y-3">
      {/* Phase 1 */}
      <div className="bg-surface-900 border border-brand-blue/20 rounded-xl p-4 flex gap-4 items-start">
        <div className="shrink-0 flex flex-col items-center gap-1">
          <span className="w-9 h-9 bg-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-white">01</span>
          <span className="text-xs font-bold text-brand-blue-light">Phase 1</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">数据整合与画像</div>
          <p className="text-xs text-gray-500 mb-3">整合车内、三方、内部三类数据源，建立欧曼银河司机用户画像基线</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-brand-blue-light font-medium mb-1">T-Box 车联网</div>
              <p className="text-gray-400 leading-relaxed">GPS · 油耗 · 里程 · 故障码 · 驾驶行为 · 怠速时长 · 设施使用</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-brand-blue-light font-medium mb-1">三方舆情</div>
              <p className="text-gray-400 leading-relaxed">卡车之家 · 抖音/快手 · 运满满货主反馈</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-brand-blue-light font-medium mb-1">内部系统</div>
              <p className="text-gray-400 leading-relaxed">售后维修 · 400客服 · CRM 车主信息</p>
            </div>
          </div>
          <div className="mt-2 text-xs"><span className="text-brand-blue font-medium">产出 </span><span className="text-gray-400">用户画像 V1.0 + 舆情监测基线报告</span></div>
        </div>
      </div>

      {/* Phase 2 */}
      <div className="bg-surface-900 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start">
        <div className="shrink-0 flex flex-col items-center gap-1">
          <span className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">02</span>
          <span className="text-xs font-bold text-amber-400">Phase 2</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">洞察生成与验证</div>
          <p className="text-xs text-gray-500 mb-3">AI 自动打标 + 聚类分群 + 小数据深挖，形成可落地的产品改进建议</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-amber-400 font-medium mb-1">LLM 自动标注</div>
              <p className="text-gray-400 leading-relaxed">场景 → 功能 → 情感 三级打标，识别高频投诉与情绪峰值</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-amber-400 font-medium mb-1">聚类分群</div>
              <p className="text-gray-400 leading-relaxed">按运营路线、载重、油耗对司机分层画像</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-amber-400 font-medium mb-1">小数据深挖</div>
              <p className="text-gray-400 leading-relaxed">大数据 Top 3 痛点 → 跟车访谈 + 实车测试 → 根因验证</p>
            </div>
          </div>
          <div className="mt-2 text-xs"><span className="text-amber-400 font-medium">产出 </span><span className="text-gray-400">洞察季报 + Top 3 痛点改进建议报告</span></div>
        </div>
      </div>

      {/* Phase 3 */}
      <div className="bg-surface-900 border border-emerald-500/20 rounded-xl p-4 flex gap-4 items-start">
        <div className="shrink-0 flex flex-col items-center gap-1">
          <span className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">03</span>
          <span className="text-xs font-bold text-emerald-400">Phase 3</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">看板上线与推广</div>
          <p className="text-xs text-gray-500 mb-3">四屏看板上线 + 闭环追踪 + 方法论文档化，并横向推广至其他产品线</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-emerald-400 font-medium mb-1">洞察看板 V1.0</div>
              <p className="text-gray-400 leading-relaxed">舆情趋势 · 用户画像 · 问题热力图 · 竞品动态</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-emerald-400 font-medium mb-1">闭环追踪</div>
              <p className="text-gray-400 leading-relaxed">改进建议 → 研发采纳 → 效果回检</p>
            </div>
            <div className="bg-surface-950 border border-gray-700 rounded-lg p-2.5">
              <div className="text-emerald-400 font-medium mb-1">横向推广</div>
              <p className="text-gray-400 leading-relaxed">工具链与 SOP 推广至银河 5/5M、轻卡奥铃/时代</p>
            </div>
          </div>
          <div className="mt-2 text-xs"><span className="text-emerald-400 font-medium">产出 </span><span className="text-gray-400">看板上线 + 方法论 SOP + 推广计划</span></div>
        </div>
      </div>
    </div>
  </div>
)}
