let seed=[],dataset=null,offset=0,filter='all';
const $=s=>document.querySelector(s);
function readStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const storedFollowing=readStorage('maodou-official-following-v1',[]);
const saved=new Set(Array.isArray(storedFollowing)?storedFollowing:[]);
document.documentElement.dataset.theme=(localStorage.getItem('theme')??localStorage.getItem('maodou-theme'))==='dark'?'dark':'light';
let base=new Date('2026-11-02T00:00:00Z');
const week=['周一','周二','周三','周四','周五','周六','周日'];
const getDate=day=>new Date(base.getTime()+(offset*7+day)*86400000);
const dayMs=86400000, historyWeeks=26;

function weekLabel(start){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get=type=>parts.find(part=>part.type===type).value;
 const today=new Date(`${get('year')}-${get('month')}-${get('day')}T00:00:00Z`);
 const monday=today.getTime()-((today.getUTCDay()+6)%7)*dayMs;
 const delta=(start.getTime()-monday)/(7*dayMs);
 return delta<0?'历史日程':delta===0?'本周前瞻':delta===1?'下周前瞻':'未来日程';
}
function showHistory(){
 const counts=new Map();
 for(const e of seed) counts.set(e.event_date,(counts.get(e.event_date)||0)+1);
 const anchor=Math.max(base.getTime(),...seed.map(e=>Date.parse(e.event_date+'T00:00:00Z')));
 const lastWeek=Math.floor((anchor-base.getTime())/(7*dayMs));
 const firstWeek=Math.min(lastWeek-historyWeeks+1,...seed.map(e=>Math.floor((Date.parse(e.event_date+'T00:00:00Z')-base.getTime())/(7*dayMs))));
 const columns=lastWeek-firstWeek+1;
 const first=new Date(base.getTime()+firstWeek*7*dayMs), last=new Date(base.getTime()+(lastWeek*7+6)*dayMs);
 $('#history-range').textContent=`${first.toISOString().slice(0,10)} 至 ${last.toISOString().slice(0,10)} · 北京时间`;
 const grid=$('#history-grid');grid.style.setProperty('--weeks',columns);
 let markup='';
 week.forEach((name,i)=>{markup+=`<span class="history-weekday" style="grid-row:${i+2}">${name}</span>`});
 let month=-1;
 for(let w=0;w<columns;w++)for(let d=0;d<7;d++){
   const day=new Date(first.getTime()+(w*7+d)*dayMs), iso=day.toISOString().slice(0,10), n=counts.get(iso)||0;
   if(d===0&&month!==day.getUTCMonth()){month=day.getUTCMonth();markup+=`<span class="history-month" style="grid-column:${w+2}">${month+1}月</span>`}
   const label=`${iso} · ${week[d]} · ${n?`${n} 条事件`:'未收录'}`;
   markup+=`<button class="history-cell" style="grid-column:${w+2};grid-row:${d+2}" data-count="${Math.min(n,4)}" data-offset="${firstWeek+w}" data-day="${d}" aria-label="${label}" title="${label}" ${n?'':'disabled'}></button>`;
 }
 grid.innerHTML=markup;
 $('#history-info').textContent=`${counts.size} 天有收录 · 点击日期查看`;
 grid.querySelectorAll('button:enabled').forEach(cell=>{cell.onmouseenter=cell.onfocus=()=>{$('#history-info').textContent=cell.title};cell.onclick=()=>{
   offset=Number(cell.dataset.offset);filter='all';syncFilters();render();$('#history').close();
   const heading=$(`#day-${cell.dataset.day}`);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'})}
 }});
 $('#history').showModal();grid.parentElement.scrollLeft=grid.parentElement.scrollWidth;
}
const date=d=>`${d.getUTCMonth()+1}月${d.getUTCDate()}日`;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const questions={
 'bls-employment-202610':'新增就业、失业率与工资变化，是否给出一致的劳动力市场信号？',
 'boe-mpc-202611':'利率决定与新一轮经济预测，传递怎样的政策路径？',
 'qcom-fy2026-call':'全年经营表现与下一阶段指引，能否在电话会上得到更清晰的解释？',
 'arm-fy2027-q2-call':'管理层如何解释这一季的收入表现与后续业务展望？',
 'ism-manufacturing-202611':'新订单与生产分项，如何呈现制造业的变化？',
 'ism-services-202611':'业务活动与就业分项，如何呈现服务业的变化？',
 'bls-jolts-202609':'职位空缺与人员流动，反映出怎样的用工需求？',
 'bls-productivity-2026q3':'生产率与单位成本，呈现怎样的变化？'
};
const priority=['nbs-inflation-202610','bls-cpi-202610','coreweave-q3-2026-call','bls-employment-202610','qcom-fy2026-call','boe-mpc-202611','arm-fy2027-q2-call'];
function visible(){return seed.map((e,id)=>({...e,id,day:Math.floor((Date.parse(e.event_date+'T00:00:00Z')-base.getTime())/86400000)-offset*7})).filter(e=>e.day>=0&&e.day<7&&(filter==='all'||e.category===filter))}
function updateTheme(){const dark=document.documentElement.dataset.theme==='dark';$('#theme-toggle').textContent=dark?'☀ 浅色':'☾ 深色';$('#theme-toggle').setAttribute('aria-label',dark?'切换浅色主题':'切换深色主题')}
function followButton(e){const on=saved.has(e.uid);return `<button class="follow ${on?'following':''}" data-follow="${e.id}" aria-pressed="${on}" aria-label="${on?'取消关注':'关注'}${esc(e.title)}" title="${on?'取消关注':'关注'}">${on?'★':'☆'}</button>`}
function forecasts(event){
 return (event.expectations||[]).filter(item=>item.summary&&item.source_name&&item.as_of&&/^https:\/\//.test(item.source_url));
}
function syncNotice(){
 const sync=dataset.sync;
 const at=sync?.last_success_at;
 const time=at?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'short',timeStyle:'short',hour12:false}).format(new Date(at)):'尚无成功同步记录';
 $('#sync-status').textContent=`官方日历最后检查：${time} · 覆盖美国 BEA、英国 ONS · 市场预期不自动更新`;
}
function watchQuestion(event){return event.watch_question||questions[event.uid]}
function focusPreview(event){
 const forecast=forecasts(event)[0];
 const question=watchQuestion(event);
 return forecast?{label:`预期快照 · ${forecast.as_of}`,text:forecast.summary}:{label:question?'关注问题':'日程摘要',text:question||event.summary};
}
function openDetail(id){
 const e=seed[id];
 const market=forecasts(e).map(item=>`<p>${esc(item.summary)}</p><a href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">${esc(item.source_name)} · ${esc(item.as_of)} ↗</a>`).join('');
 $('#detail-category').textContent=`${e.category==='finance'?'财经':'科技'} / ${e.tag} · 官方日程`;
 $('#detail-body').innerHTML=`<h2>${esc(e.title)}</h2><div class="detail-time">${e.event_date} · ${e.time} · 北京时间</div><div class="detail-block"><h3>已公布安排</h3><p>${esc(e.summary)}</p><span class="status">${esc(e.status)}</span></div><div class="detail-block"><h3>编辑关注问题</h3><p>${esc(watchQuestion(e)||'关注发布方披露的具体内容。')}</p></div><div class="detail-block"><h3>市场预期</h3>${market||'<p>该期未收录可核验的市场预期。</p>'}<p class="detail-note">市场预期为发布前的来源快照，实际结果以官方发布为准。</p></div><div class="detail-block"><h3>官方原始来源 ↗</h3><a href="${esc(e.source_url)}" target="_blank" rel="noopener noreferrer">${esc(e.source_name)} ↗</a><p class="detail-time">公告当地时间：${esc(e.original_time)}<br>原始时区：${esc(e.source_timezone)}<br>${e.verification_method==='official_calendar_sync'?'官方日历同步日期':'人工核验日期'}：${esc(e.verified_on)}</p></div><p class="detail-note">按官方已公布日程整理，后续调整以发布方为准。</p>`;
 $('#detail').showModal();
}
function render(){
 const events=visible();
 const label=weekLabel(getDate(0));
 $('#week-title').textContent=label;
 const sorted=[...events].sort((a,b)=>{const ai=priority.indexOf(a.uid),bi=priority.indexOf(b.uid);return (ai<0?99:ai)-(bi<0?99:bi)||b.level-a.level||a.start_at.localeCompare(b.start_at)});
 $('#week-range').innerHTML=`${date(getDate(0))} — ${date(getDate(6))}<small>${getDate(0).getUTCFullYear()}</small>`;
 const themes=[];
 if(events.some(e=>e.tag==='通胀'))themes.push('中美通胀');
 if(events.some(e=>e.tag==='经济增长'))themes.push('英国经济增长');
 if(events.some(e=>e.tag==='就业数据'))themes.push('美国就业数据');
 if(events.some(e=>e.category==='technology'))themes.push('科技公司业绩');
 if(events.some(e=>e.tag==='央行'))themes.push('英国央行决议');
 $('#week-themes').textContent=events.length?`关注主题：${themes.length?themes.join('、'):'已收录的官方发布日程'}`:'该周暂无已核验日程';
 $('#event-count').textContent=`${events.length} 条日程 · 北京时间`;
 $('#focus-title').textContent=sorted.length>=3?'本期三件大事':'本期重点';
 $('#highlights').innerHTML=sorted.length?sorted.slice(0,3).map((e,i)=>`<button class="highlight" data-id="${e.id}"><div class="focus-meta"><span>${week[e.day]} · ${e.time}</span><span class="focus-index">0${i+1}</span></div><h3>${esc(e.title)}</h3><p><span>${focusPreview(e).label}</span>${esc(focusPreview(e).text)}</p></button>`).join(''):'<div class="wide-empty">暂无已核验重点。可切回收录周查看。</div>';
 let content='';
 for(let day=0;day<7;day++){
   const rows=events.filter(e=>e.day===day).sort((a,b)=>a.start_at.localeCompare(b.start_at)||a.uid.localeCompare(b.uid));
   if(day===5&&!events.some(e=>e.day>=5)){content+='<div class="weekend-note"><span>周末</span><span>暂无已核验日程</span></div>';break}
   const d=getDate(day),iso=d.toISOString().slice(0,10);
   content+=`<section class="day" aria-labelledby="day-${day}"><div class="day-label"><h3 id="day-${day}">${week[day]}</h3><time datetime="${iso}">${d.getUTCMonth()+1}/${String(d.getUTCDate()).padStart(2,'0')}</time><span class="date-year">${d.getUTCFullYear()}</span></div><div class="day-events">${rows.length?rows.map(e=>`<article class="event-row" data-uid="${e.uid}"><time class="event-time" datetime="${e.start_at}">${e.time}</time><button class="event-content" data-id="${e.id}"><div class="event-title-line"><h4>${esc(e.title)}</h4><span class="event-tag">${e.category==='finance'?'财经':'科技'} · ${esc(e.tag)}</span></div><p>${esc(focusPreview(e).label)}：${esc(focusPreview(e).text)}</p></button>${followButton(e)}</article>`).join(''):'<p class="day-empty">暂无已核验日程</p>'}</div></section>`;
 }
 $('#calendar').innerHTML=content;
 document.querySelectorAll('[data-id]').forEach(el=>el.onclick=()=>openDetail(Number(el.dataset.id)));
 document.querySelectorAll('[data-follow]').forEach(el=>el.onclick=()=>{const e=seed[Number(el.dataset.follow)];saved.has(e.uid)?saved.delete(e.uid):saved.add(e.uid);localStorage.setItem('maodou-official-following-v1',JSON.stringify([...saved]));const on=saved.has(e.uid);el.classList.toggle('following',on);el.textContent=on?'★':'☆';el.setAttribute('aria-pressed',String(on));el.setAttribute('aria-label',`${on?'取消关注':'关注'}${e.title}`);el.title=on?'取消关注':'关注'});
}
$('#prev').onclick=()=>{offset--;render()};$('#next').onclick=()=>{offset++;render()};$('#reset').onclick=()=>{offset=0;render()};
function syncFilters(){document.querySelectorAll('[data-filter]').forEach(x=>{const on=x.dataset.filter===filter;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on))})}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;syncFilters();render()});
$('#history-open').onclick=showHistory;
$('#history-close').onclick=()=>$('#history').close();
$('#close').onclick=()=>$('#detail').close();
for(const id of ['#detail','#history']){
 const dialog=$(id);
 dialog.addEventListener('click',e=>{
   if(e.target!==dialog)return;
   const r=dialog.getBoundingClientRect();
   if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
 });
}
$('#theme-toggle').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('theme',document.documentElement.dataset.theme);updateTheme()};updateTheme();
async function loadEvents(){try{
 const response=await fetch(new URL('./data/events.json',document.baseURI),{cache:'no-cache'});if(!response.ok)throw new Error('日程文件不可用');dataset=await response.json();
 seed=dataset.events.filter(e=>e.publication_status==='published').map(e=>{if(new URL(e.source_url).protocol!=='https:')throw new Error('来源链接无效');const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(e.start_at));const get=t=>parts.find(p=>p.type===t).value;return {...e,event_date:`${get('year')}-${get('month')}-${get('day')}`,time:new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(e.start_at))}});
 base=new Date(dataset.week_start+'T00:00:00Z');document.querySelector('.demo').textContent=`人工内容最近核验于 ${dataset.checked_on}。官方日程独立同步，历史预期保留原始快照日期；实际安排以发布方为准。`;syncNotice();render();$('#history-open').disabled=false;
 }catch(error){document.querySelector('.demo').textContent='日程加载失败。';$('#calendar').innerHTML='<p class="wide-empty">日程暂时无法加载，请刷新重试。</p>';console.error(error)}
}loadEvents();
