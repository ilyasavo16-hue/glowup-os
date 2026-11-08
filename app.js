'use strict';

const SHAPES = {
  spark:'<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/>',
  moon:'<path d="M20.8 15.2A9 9 0 0 1 8.8 3.2a9 9 0 1 0 12 12Z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2m-8 3h2"/>',
  layers:'<rect x="7" y="3" width="14" height="14" rx="3"/><path d="M17 21H6a3 3 0 0 1-3-3V7m8 1h6m-6 4h4"/>',
  heart:'<path d="M20.8 5.8c-2.2-2.1-5.6-1.8-7.6.3L12 7.4l-1.2-1.3c-2-2.1-5.4-2.4-7.6-.3-2.4 2.3-2 6 .3 8.2L12 22l8.5-8c2.3-2.2 2.7-5.9.3-8.2Z"/>',
  settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2.5" fill="var(--surface)"/><circle cx="15" cy="17" r="2.5" fill="var(--surface)"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', left:'<path d="m15 5-7 7 7 7"/>', right:'<path d="m9 5 7 7-7 7"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>', check:'<path d="m5 12 4 4 10-10"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  music:'<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>',
  case:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12l9 2 9-2m-9 0v3"/>',
  study:'<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v7"/>',
  car:'<path d="m4 11 2-6h12l2 6M4 18v2m16-2v2M3 15v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5H3v-3Zm3 0h2m8 0h2"/>',
  food:'<path d="M4 3v5a3 3 0 0 0 6 0V3M7 3v18M20 3c-4 1-5 6-5 10h5m0-10v18"/>',
  gym:'<path d="M2 12h2m16 0h2M8 12h8"/><rect x="4" y="6" width="4" height="12" rx="1"/><rect x="16" y="6" width="4" height="12" rx="1"/>',
  chart:'<path d="M4 4v16h16M8 15l4-5 4 2 4-6"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12a2 2 0 0 0 4 0"/>',
  note:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>'
};
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SHAPES[name]||SHAPES.note}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action=(name,value)=>`data-action="${name}"${value===undefined?'':` data-value="${esc(value)}"`}`;
const ib=(name,label,act,value,cls='')=>`<button type="button" class="icon-button ${cls}" aria-label="${esc(label)}" ${action(act,value)}>${icon(name)}</button>`;
const button=(label,act,value,cls='secondary')=>`<button type="button" class="${cls}" ${action(act,value)}>${esc(label)}</button>`;
const badge=(name,tone='blue')=>`<span class="badge tone-${tone}">${icon(name)}</span>`;
const row=(name,tone,title,sub='',act,value)=>`<${act?'button type="button"':'div'} class="row" ${act?action(act,value):''}>${badge(name,tone)}<span class="row-main"><strong>${esc(title)}</strong>${sub?`<span class="meta">${esc(sub)}</span>`:''}</span>${act?icon('right','chevron'):''}</${act?'button':'div'}>`;
const check=(done,name,act,value)=>`<button type="button" class="check" aria-pressed="${!!done}" aria-label="${esc(name)}" ${action(act,value)}><span>${done?icon('check'):''}</span></button>`;
const card=(body,cls='')=>`<div class="card ${cls}">${body}</div>`;
const empty=s=>`<p class="empty">${esc(s)}</p>`;
const section=(name,body,cta='')=>`<section><div class="heading-row section-title"><h2>${esc(name)}</h2>${cta}</div>${body}</section>`;
const head=(label,title,sub='',right='')=>`<header class="page-head"><p class="eyebrow">${esc(label)}</p><div class="heading-row"><h1>${esc(title)}</h1>${right}</div>${sub?`<p class="page-note">${esc(sub)}</p>`:''}</header>`;
const detail=(title,body,open=false)=>`<details${open?' open':''}><summary>${esc(title)}</summary><div class="details-content flow">${body}</div></details>`;
const field=(title,name,val='',opts='')=>`<label class="field">${esc(title)}<input name="${name}" value="${esc(val)}" ${opts}></label>`;
const number=(title,name,val='',opts='')=>field(title,name,val,`type="number" inputmode="decimal" min="0" step="any" ${opts}`);
const select=(title,name,items,current)=>`<label class="field">${esc(title)}<select name="${name}">${items.map(([value,label])=>`<option value="${esc(value)}"${String(current)===String(value)?' selected':''}>${esc(label)}</option>`).join('')}</select></label>`;
const textarea=(title,name,val='')=>`<label class="field">${esc(title)}<textarea name="${name}" rows="3">${esc(val)}</textarea></label>`;
const stat=(value,name)=>`<div class="stat"><strong>${esc(value)}</strong><span class="meta">${esc(name)}</span></div>`;
const formEnd=(deleteAct='',value,word='Сохранить')=>`<p class="form-error" role="alert"></p><div class="sheet-actions">${deleteAct?button('Удалить',deleteAct,value,'delete-button'):''}<button class="primary" type="submit">${word}</button></div>`;
const ui={page:'today',sub:'',date:today(),healthDate:today(),filter:'day'};
const tabs={today:['sun','Сегодня'],calendar:['calendar','Календарь'],projects:['layers','Проекты'],health:['heart','Здоровье']};
const projects={
  music:{name:'Музыка',icon:'music',tone:'purple',title:'Биты для Fatt Mack',date:'До 31 декабря',text:'Работай над звуком для Fatt Mack до Нового года. Темп и количество битов выбираешь сам.'},
  business:{name:'Бизнес',icon:'case',tone:'green',title:'Первая оплаченная продажа',date:'До 31 декабря',text:'Доведи хотя бы один диалог до оплаты за бит.'},
  study:{name:'Учёба',icon:'study',tone:'blue',title:'Университет',date:'Группа 3-ТТП-26',text:'Пары по числителю и знаменателю, подготовка и свои задачи.'}
};
const view=document.getElementById('view');
const sheet=document.getElementById('sheet');
const sheetInner=document.getElementById('sheet-inner');
const toolbar=document.getElementById('toolbar');
const nav=document.getElementById('nav');
const visual=window.visualViewport;
let sheetFrom, toastTimer, focusSignature, pageSignature;
const nf=n=>new Intl.NumberFormat('ru',{maximumFractionDigits:2}).format(n);
const weekLabel=d=>weekKind(d)==='num'?'Числитель':'Знаменатель';
const dateInput=(label,name,value,required=false)=>field(label,name,value,'type="date"'+(required?' required':''));
const noteFor=d=>state.extra.notes?.[d]??dayOf(d).note??'';

function drawFrame(){
  const back=ui.sub? `<button class="back-button" ${action('back')}>${icon('left')} ${ui.sub==='settings'?'Назад':tabs[ui.page][1]}</button>`:'';
  const mark=`<span class="brand"><span class="brand-mark">${icon('spark')}</span>GLOWUP OS</span>`;
  toolbar.innerHTML=`<div class="toolbar-left">${back||mark}</div><div class="toolbar-right">${!ui.sub?ib('settings','Настройки','settings',undefined,'glass'):''}${['today','calendar','projects'].includes(ui.page)&&ui.sub!=='settings'?ib('plus','Добавить','entry',undefined,'add'):''}</div>`;
  nav.innerHTML=Object.entries(tabs).map(([id,[glyph,name]])=>`<button type="button" ${action('nav',id)}${ui.page===id?' aria-current="page"':''}>${icon(glyph)}${name}</button>`).join('');
}
function draw(){
  const sig=ui.page+'/'+ui.sub;
  const changed=sig!==pageSignature;
  if(changed){drawFrame(); pageSignature=sig;}
  const warning=document.getElementById('storage-warning');
  warning.hidden=!storageIssue;
  warning.textContent=storageIssue||'';
  const render=ui.sub==='settings'?settingsView:({today:todayView,calendar:calendarView,projects:projectView,health:healthView})[ui.page];
  const open=new Set([...view.querySelectorAll('details[open][data-keep]')].map(x=>x.dataset.keep));
  view.innerHTML=`<div ${changed?'class="page"':''}>${render()}</div>`;
  if(!changed) for(const x of view.querySelectorAll('details[data-keep]')) if(open.has(x.dataset.keep)) x.open=true;
}
function route(page,sub=''){
  ui.page=page; ui.sub=sub;
  draw(); window.scrollTo(0,0); view.focus({preventScroll:true});
}
function taskRow(t,showDate=false){
  const sub=[category(t.category),showDate&&t.date?short(t.date):'',t.due?'до '+short(t.due):'',t.duration?t.duration+' мин':'',t.suggested?'черновик':''].filter(Boolean).join(' · ');
  return `<div class="row ${t.done?'complete':''}">${check(t.done,(t.done?'Снять отметку: ':'Отметить: ')+t.text,'task-toggle',t.id)}<button type="button" class="task-edit" ${action('task-edit',t.id)}><strong>${esc(t.text)}</strong><span class="meta">${esc(sub)}</span></button>${icon('right','chevron')}</div>`;
}
function agendaRow(e,i,list,withConflict=true){
  const info={pair:['study','blue','Пара'],trip:['car','gray','Дорога'],drive:['car','amber','Вождение'],event:['calendar','purple','Событие'],task:['check','green','Задача']};
  const [glyph,tone,kind]=info[e.type];
  const labels=[e.sub||e.category||kind];
  if(e.entry?.repeat && e.entry.repeat!=='none') labels.push('повтор');
  if(withConflict && overlaps(list,i)) labels.push('пересечение');
  const act=e.type==='task'?'task-edit':e.type==='event'?'event-edit':'';
  return `<${act?'button type="button"':'div'} class="row ${e.entry?.done?'complete':''}" ${act?action(act,e.id):''}><span class="time-cell">${hm(e.start)}<span class="meta">${hm(e.end)}</span></span>${badge(glyph,tone)}<span class="row-main"><strong>${esc(e.title)}</strong><span class="meta">${esc(labels.join(' · '))}</span></span>${act?icon('right','chevron'):''}</${act?'button':'div'}>`;
}
function focusView(now=new Date()){
  const f=focus(now), d=ymd(now), m=minute(now);
  let label,title,desc,glyph='spark',cta='',act,value;
  if(f.event){
    const e=f.event;
    label=f.kind==='current'?'Сейчас':'Далее';
    glyph=e.type==='trip'?'car':'clock';
    title=e.title;
    desc=[hm(e.start)+'–'+hm(e.end),e.sub,f.count>1?'есть пересечение':''].filter(Boolean).join(' · ');
    cta=e.type==='task'?'Открыть задачу':'Расписание дня';
    act=e.type==='task'?'task-edit':'calendar-day'; value=e.type==='task'?e.id:d;
  } else if(f.kind==='task'){
    label='Следующее действие'; title=f.task.text;
    desc=[category(f.task.category),`${+f.task.duration||25} мин`,f.task.due?`срок ${short(f.task.due)}`:'',`окно до ${hm(f.end)}`].filter(Boolean).join(' · ');
    cta='Открыть задачу'; act='task-edit'; value=f.task.id;
  } else if(f.kind==='care'){
    label='По времени дня'; title=f.care==='am'?'Утренний уход':'Вечерний уход';
    desc=`Свободно ещё ${f.end-m} мин`; cta='Открыть уход'; act='health-sub'; value='care';
  } else if(f.kind==='night'){
    label='Ночной режим'; title='Время для отдыха'; glyph='moon';
    desc=f.next?`Следующее событие в ${hm(f.next.start)}`:'Утром здесь появится ближайшее действие по плану.';
  } else {
    label='Свободное окно'; title=f.next?`До ${hm(f.end)} свободно`:'Вечер без событий';
    if(!f.next && m<1080) title='День без срочных дел';
    desc=f.next?`Далее · ${f.next.title}`:'Ближайшие дела появятся здесь по мере добавления.';
  }
  return `<div class="focus"><p class="eyebrow">${icon(glyph)} ${esc(label)}</p><h2>${esc(title)}</h2><p>${esc(desc)}</p>${cta?`<button type="button" class="focus-button" ${action(act,value)}>${cta}${icon('arrow')}</button>`:''}</div>`;
}
function todayView(now=new Date()){
  const d=ymd(now), m=minute(now), all=agenda(d), upcoming=all.filter(e=>e.end>m&&blocksTime(e));
  const day=dayOf(d), score=healthScore(d);
  const matches=tasks().filter(t=>!archival(t)&&t.date===d&&!t.start);
  const done=matches.filter(t=>t.done).length;
  const time=`<time id="clock" class="clock">${icon('clock')} ${hm(m)}</time>`;
  const shown=upcoming.slice(0,2);
  return head(longDate(d),'Сегодня','',time)+`<div class="layout two"><div class="stack">
    <div id="focus-slot">${focusView(now)}</div>
    ${section('План дня',card(shown.length?shown.map((e,i)=>agendaRow(e,i,shown,false)).join(''):empty(all.length?'На сегодня всё по расписанию завершилось.':'На сегодня нет событий по времени.')))}
    </div><div class="stack">
    ${section('Обзор',card(row('layers','purple','Задачи дня',matches.length?`${done} из ${matches.length} выполнено`:'Пока без задач','calendar-tasks',d)+
    row('heart','rose','Здоровье',`${score.done} из ${score.total} пунктов · ${nf(sumOf(day,'p'))} г белка`,'nav','health')+
    row('note','amber','Заметка дня',noteFor(d)?noteFor(d).slice(0,80):'Добавь короткую запись','note',d)))}
    ${inHospital(d)?`<p class="notice">Больничный режим до ${esc(short(settings().hospitalUntil))} включительно.</p>`:''}
    </div></div>`;
}
function weekView(){
  const mon=mondayOf(ui.date), month=parse(ui.date).toLocaleDateString('ru',{month:'long',year:'numeric'});
  return card(`<div class="cal-tools">${ib('left','Предыдущая неделя','week',-7)}<strong>${esc(month)}</strong>${ib('right','Следующая неделя','week',7)}</div><div class="week" aria-label="Дни недели">${Array.from({length:7},(_,i)=>{
    const d=add(mon,i),has=agenda(d).length||tasks().some(t=>t.date===d&&!archival(t));
    return `<button type="button" ${action('date',d)} aria-label="${esc(longDate(d))}" aria-pressed="${d===ui.date}" ${d===today()?'aria-current="date"':''}><span class="meta">${WD[wd(d)]}</span>${parse(d).getDate()}<span class="day-dot ${has?'':'clear'}"></span></button>`;
  }).join('')}</div>`);
}
function calendarView(){
  const d=ui.date, list=agenda(d);
  const shownTasks=orderedTasks(tasks().filter(t=>!archival(t)&&(ui.filter==='day'?t.date===d&&(!t.start||t.done):ui.filter==='active'?!t.done:!!t.done)));
  const windows=gaps(list).filter(([a,b])=>b-a>=20);
  const tt=dayTT(d);
  const dayNote=inHospital(d)?'Больничный режим · пары и вождение скрыты':tt?.note||(!tt?'Для этого дня пары в исходном расписании не указаны.':'');
  return head('Личный план','Календарь','')+`<div class="layout two"><div class="stack">
    <div>${weekView()}<details class="calendar-date" data-keep="jump"><summary>Перейти к дате</summary><div class="flow">${dateInput('Дата','jump-date',d)}${button('Сегодня','date',today())}</div></details></div>
    ${section('Расписание',card(list.length?list.map((e,i)=>agendaRow(e,i,list)).join(''):empty('На этот день нет событий.')), `<span class="tag">${weekLabel(d)}</span>`)}
    ${dayNote?`<p class="notice">${esc(dayNote)}</p>`:''}
    </div><div class="stack">
    ${section('Задачи',`<div class="flow"><div class="segment" role="group" aria-label="Список задач">${[['day','На день'],['active','Активные'],['done','Готовые']].map(([k,n])=>`<button type="button" aria-pressed="${ui.filter===k}" ${action('task-filter',k)}>${n}</button>`).join('')}</div>${card(shownTasks.length?shownTasks.map(t=>taskRow(t,ui.filter!=='day')).join(''):empty('Здесь пока пусто.'))}</div>`)}
    ${section('Свободные окна',card(windows.length?`<div class="pad chips">${windows.map(([a,b])=>`<span class="tag">${hm(a)}–${hm(b)}</span>`).join('')}</div>`:empty('Днём нет окон от 20 минут.')))}
    ${card(row('note','amber','Заметка дня',noteFor(d)?noteFor(d).slice(0,80):'Короткая запись','note',d))}
    </div></div>`;
}
function projectView(){
  if(!ui.sub) return head('До Нового года','Проекты','')+`<div class="layout projects">${Object.entries(projects).map(([key,p])=>{
    const active=tasks().filter(t=>!archival(t)&&!t.done&&category(t.category)===p.name).length;
    return card(`<button class="project-card" ${action('project',key)}>${badge(p.icon,p.tone)}<span class="row-main"><h2>${p.name}</h2><p>${p.title}</p><span class="meta">${p.date}${active?' · '+active+' в работе':''}</span></span>${icon('right','chevron')}</button>`);
  }).join('')}</div>`;
  const p=projects[ui.sub];
  const list=orderedTasks(tasks().filter(t=>!archival(t)&&category(t.category)===p.name));
  const biz=state.database['meta/biz']||{};
  const bizBlocks=section('Агенты Codex',card(`<div class="pad flow"><span class="eyebrow">До 15 ноября 2026</span><h3>Настройка и методичка</h3><p class="muted">Проверяй ответы на тестовых диалогах и вноси исправления в методичку.</p></div>`))+
    section('Продажи',card(`<div class="pad flow"><div class="stat-grid">${stat(biz.paid||0,'оплаченных продаж')}${stat('$'+nf(biz.usd||0),'заработано')}</div>${button('Записать результат','sales')}</div>`));
  return head(p.date,p.name,p.title)+`<div class="layout two"><div class="stack">
    ${card(`<div class="pad inline">${badge(p.icon,p.tone)}<p>${p.text}</p></div>`)}
    ${ui.sub==='business'?bizBlocks:ui.sub==='study'?card(row('calendar','blue','Расписание пар','Календарь и дорога','calendar-day',today())):''}
    </div><div class="stack">${section('Задачи проекта',card(list.length?list.map(t=>taskRow(t,true)).join(''):empty('Добавь задачу через «+».')))}</div></div>`;
}
const healthNames={care:'Уход',food:'Питание',gym:'Тренировки',progress:'Прогресс'};
function healthDateBar(d){
  return card(`<div class="cal-tools">${ib('left','Предыдущий день','health-date',-1)}<strong>${esc(longDate(d))}</strong>${ib('right','Следующий день','health-date',1)}</div>`);
}
function healthView(){
  if(ui.sub){
    const d=ui.healthDate;
    const views={care:careView,food:foodView,gym:gymView,progress:progressView};
    return head('Здоровье',healthNames[ui.sub],'',ui.sub==='food'?ib('plus','Записать еду','meal',undefined,'add'):'')+
      (ui.sub==='progress'?'':healthDateBar(d))+`<div class="health-content">${views[ui.sub](d)}</div>`;
  }
  const d=today(), day=dayOf(d), cfg=settings(), score=healthScore(d);
  const hours=sleepFor(d);
  return head('Личный журнал','Здоровье','')+`<div class="layout two"><div class="stack">
    ${section('Журналы',card(row('spark','rose','Уход',`${score.done} из ${score.total} пунктов дня`,'health-sub','care')+
    row('food','green','Питание',`${nf(sumOf(day,'p'))} из ${cfg.protein} г белка`,'health-sub','food')+
    row('gym','blue','Тренировки',inHospital(d)?'Пауза на больничном':isGymDay(d)?`По плану · программа ${gymType(d)==='A'?'А':'Б'}`:'Программа А/Б и журнал подходов','health-sub','gym')+
    row('chart','purple','Прогресс','Сон, вес, кожа и контрольные даты','health-sub','progress')))}
    </div><div class="stack">${section('Сегодня',card(`<div class="pad flow"><div class="stat-grid">${stat(day.steps==null?'—':nf(day.steps),'шаги · цель '+nf(stepsTarget(d)))}${stat(hours==null?'—':nf(hours)+' ч',`сон · цель ${nf(cfg.sleepMin)}–${nf(cfg.sleepMax)} ч`)}</div>${button('Записать показатели','metrics')}</div>`))}
    ${d===TEST_DAY?`<p class="notice">Отметки 8 ноября сохранены как тестовые и исключены из графиков прогресса.</p>`:''}
    </div></div>`;
}
const trackerLabels={wake:'Время подъёма',bed:'Время отбоя',steps:'Шаги',weight:'Вес, кг',pimples:'Новые прыщи',waist:'Талия, см',veg:'Овощи и фрукты, порций',alc:'Алкоголь, порций'};
function careRow(t,d,day){
  const title=typeof t.label==='function'?t.label(d,day):t.label;
  const subtitle=t.sub?.(d,day);
  if(t.id==='gym') return row('gym','blue',title,subtitle,'health-sub','gym');
  if(t.id==='protein') return row('food','green',title,subtitle,'health-sub','food');
  if(t.field) return row(t.kind==='time'?'clock':'chart','gray',title,
    [day[t.field]==null?'':fmtN(day[t.field])+(t.unit?' '+t.unit:''),subtitle].filter(Boolean).join(' · '),'metric',t.field);
  const hints=t.more?`<details data-keep="${esc(t.id)}"><summary class="hint-summary">Шаги</summary><div class="details-content prose"><ul>${t.more.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></details>`:'';
  return `<div class="care-item"><div class="row">${check(isDone(t,d,day),title,'care-check',t.id)}<span class="row-main"><strong>${esc(title)}</strong>${subtitle?`<span class="meta">${esc(subtitle)}</span>`:''}</span></div>${hints}</div>`;
}
function careView(d){
  const day=dayOf(d);
  return `<div class="layout two"><div class="stack">${[['morning','Утро'],['evening','Вечер']].map(([group,title])=>section(title,card(TASKS.filter(t=>t.g===group&&t.show(d)).map(t=>careRow(t,d,day)).join('')))).join('')}</div>
  <div class="stack">${[['day','Днём'],['sched','По графику']].map(([group,title])=>{
    const list=TASKS.filter(t=>t.g===group&&t.show(d));
    const extra=group==='day'?row('chart','gray','Алкоголь',`${day.alc||0} сегодня · ${weekAlc(d)} за неделю`,'metric','alc'):'';
    return section(title,card(list.length||extra?list.map(t=>careRow(t,d,day)).join('')+extra:empty('На этот день дополнительных пунктов нет.')));
  }).join('')}${card(row('note','amber','Заметка дня',noteFor(d)?noteFor(d).slice(0,80):'Добавь короткую запись','note',d))}</div></div>`;
}
function foodView(d){
  const day=dayOf(d), cfg=settings(), protein=sumOf(day,'p');
  const knownSlots=new Set(SLOTS.map(s=>s.id));
  return `<div class="layout two"><div class="stack">
    ${section('Итог дня',card(`<div class="pad flow"><div class="stat-grid">${stat(nf(protein)+' г','белок · цель '+cfg.protein+' г')}${stat(nf(sumOf(day,'k')),'ккал · цель '+nf(cfg.kcalMin)+'–'+nf(cfg.kcalMax))}${stat(nf(sumOf(day,'f'))+' г','жиры')}${stat(nf(sumOf(day,'c'))+' г','углеводы')}</div>
    <progress class="meter" max="${cfg.protein||1}" value="${Math.min(cfg.protein,protein)}" aria-label="Цель по белку"></progress></div>`+
    row('food','green','Овощи и фрукты',`${day.veg||0} из ${cfg.veg} порций`,'metric','veg')))}
    </div><div class="stack">${section('Приёмы пищи',card(day.meals.length?SLOTS.map(s=>{
      const list=day.meals.filter(m=>m.slot===s.id || (s.id==='s'&&!knownSlots.has(m.slot)));
      return list.length?detail(s.name+' · '+list.length,list.map(m=>row('food','green',m.n,
        `${m.ai?'≈ ':''}${m.k||0} ккал · ${m.p||0} г белка${m.g?' · '+m.g+' г':''}`,'meal',m.id)).join(''),true):'';
    }).join(''):empty('За этот день записей нет. Нажми «+», чтобы добавить блюдо.')))}</div></div>`;
}
function gymView(d){
  const day=dayOf(d), type=gymType(d), workout=WORKOUTS[type], win=gymWinText(d);
  const segment=`<div class="segment" role="group" aria-label="Программа">${Object.entries(WORKOUTS).map(([k,w])=>`<button ${action('gym-type',k)} aria-pressed="${k===type}">${w.name}</button>`).join('')}</div>`;
  return `<div class="layout two"><div class="stack">
    ${segment}
    ${card(`<div class="pad flow"><h2>${workout.name}</h2><p class="muted">${inHospital(d)?'Зал на паузе до конца больничного.':(isGymDay(d)?'День зала по плану. ':'')+(win?'Окна от часа: '+win:'Свободных окон в часы работы зала нет.')}</p>${button(day.done?.gym?'Отменить отметку':'Отметить тренировку','gym-done',type,day.done?.gym?'secondary':'primary')}</div>`)}
    ${card(detail('Памятка тренировки','<p class="prose">Пять минут разминки и лёгкий подход первого упражнения. Отдых между подходами — 90 секунд, для ног — две минуты. Оставляй 2–3 повтора в запасе.</p>'))}
    </div><div class="stack">${section('Упражнения',card(workout.ex.map(e=>{
      const saved=day.gym?.sets?.[e.id]?.filter(s=>s?.w!=null||s?.r!=null)?.length||0;
      return row('gym','blue',e.n,`${e.sets} × ${e.lo===e.hi?e.hi:e.lo+'–'+e.hi}${saved?' · записано '+saved:''}`,'gym-set',e.id);
    }).join('')))}</div></div>`;
}
function chart(rows,format){
  if(!rows.length) return empty('Пока нет записей.');
  if(rows.length===1) return `<div class="pad"><strong>${esc(format(rows[0].v))}</strong><span class="meta">${esc(short(rows[0].d))}</span></div>`;
  const lo=Math.min(...rows.map(r=>r.v)), hi=Math.max(...rows.map(r=>r.v));
  const first=rows[0], last=rows.at(-1), span=diff(last.d,first.d)||1;
  const pts=rows.map(r=>[16+diff(r.d,first.d)/span*288,76-(r.v-lo)/(hi-lo||1)*54]);
  return `<div class="pad flow"><strong>${esc(format(last.v))}</strong><svg class="chart" viewBox="0 0 320 105" role="img" aria-label="${esc(rows.map(r=>short(r.d)+' '+format(r.v)).join(', '))}"><polyline points="${pts.map(p=>p.join(',')).join(' ')}"/>${pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3"/>`).join('')}<text x="16" y="99">${esc(short(first.d))}</text><text x="304" y="99" text-anchor="end">${esc(short(last.d))}</text></svg></div>`;
}
function progressView(){
  const d=today(), history=days().filter(k=>k!==TEST_DAY&&k<=d), recent=history.slice(-28), marks=state.database['meta/oneoffs']||{};
  const series=(key,convert=Number,source=recent)=>source.filter(x=>dayOf(x)[key]!=null&&dayOf(x)[key]!=='').map(x=>({d:x,v:convert(dayOf(x)[key])})).filter(x=>Number.isFinite(x.v));
  const sleeps=recent.filter(x=>add(x,-1)!==TEST_DAY).map(x=>({d:x,v:sleepFor(x)})).filter(x=>x.v!==null);
  const mon=add(mondayOf(d),-21), heat=Array.from({length:28},(_,i)=>{
    const date=add(mon,i), score=healthScore(date), confirmed=date!==TEST_DAY&&history.includes(date);
    const tip=confirmed?`${short(date)} · ${score.done} из ${score.total}`:short(date)+(date===TEST_DAY?' · тест':'');
    return `<span class="${confirmed&&score.done?'marked':''}" title="${esc(tip)}" aria-label="${esc(tip)}">${parse(date).getDate()}</span>`;
  }).join('');
  return `<div class="layout two"><div class="stack">
    ${section('Последние 4 недели',card(`<div class="pad flow"><div class="heat">${heat}</div><p class="muted">Тестовые записи 8 ноября сохранены в журнале.</p></div>`))}
    ${section('Подъём',card(chart(series('wake',tmin,recent.filter(x=>diff(d,x)<14)),hm)))}
    ${section('Сон',card(chart(sleeps,n=>nf(n)+' ч')))}
    ${section('Вес',card(chart(series('weight'),n=>nf(n)+' кг')))}
    ${section('Талия',card(chart(series('waist'),n=>nf(n)+' см')))}
    ${section('Новые прыщи',card(chart(series('pimples'),n=>nf(n)+' шт.')))}
    </div><div class="stack">
    ${section('Контрольные точки',card(`<div class="pad flow"><div class="stat-grid">${stat(history.filter(x=>dayOf(x).done?.gym).length,'тренировки')}${stat(Math.max(0,1+Math.floor(diff(d,'2026-10-20')/7))+' / 12','неделя Аклифа по плану')}</div></div>`+
    ONEOFFS.map(o=>`<div class="row">${check(marks[o.id],o.n,'oneoff',o.id)}<span class="row-main"><strong>${esc(o.n)}</strong>${dateOK(marks[o.id])?`<span class="meta">${esc(short(marks[o.id]))}</span>`:''}</span></div>`).join('')))}
    </div></div>`;
}
function settingsView(){
  const archived=orderedTasks(tasks().filter(archival));
  const business=state.database['meta/biz']||{};
  const weekKeys=Object.keys(state.database).filter(k=>k.startsWith('weeks/')).sort().reverse();
  return head('GlowUp OS · 5.0','Настройки','')+`<div class="layout two"><div class="stack">
    ${section('План и напоминания',card(row('settings','blue','Режим и расписание','Дорога, дни зала, вождение и больничный','regime')+
    row('heart','rose','Цели здоровья','Питание, шаги и сон','health-goals')+
    row('bell','amber','Уведомления iPhone','Экспорт в Календарь · Web Push не подключён','notifications')))}
    ${section('Данные',card(row('download','blue','Скачать резервную копию','Журналы, задачи, заметки и календарь','backup')+
    `<label class="row file-button">${badge('download','green')}<span class="row-main"><strong>Восстановить из JSON</strong><span class="meta">Поддерживаются копии 4.0 и 5.0</span></span><input type="file" id="restore-file" accept=".json,application/json" aria-label="Восстановить из JSON"></label>`+
    (storageIssue?row('download','amber','Скачать исходные данные','Содержимое хранилища без преобразования','raw-backup'):'')+
    (recoveryAvailable()?row('download','amber','Скачать копию до восстановления','Снимок данных перед последним импортом бэкапа','recovery'):'')+
    row('note','gray','Отчёт и пакет задач','Скачать сводку или импортировать задачи','sync')))}
    </div><div class="stack">
    ${section('Архив 4.0',card(`<details data-keep="archive"><summary>Прежние задачи · ${archived.length}</summary><div class="details-content">${archived.length?archived.map(t=>taskRow(t,true)).join(''):empty('Сохранённых задач из старого плана нет.')}</div></details>
    <details data-keep="old-business"><summary>Старый бизнес-план</summary><div class="details-content flow">
    ${PERIODS.map(p=>`<details><summary>${esc(p.t)}</summary><div class="details-content prose"><ul>${p.items.map(([id,title])=>`<li>${business.checks?.[id]?'✓ ':''}${esc(title)}</li>`).join('')}</ul></div></details>`).join('')}
    ${detail('Ворота для лупов','<ul>'+GATES.map(([id,title])=>`<li>${business.gates?.[id]?'✓ ':''}${esc(title)}</li>`).join('')+'</ul>')}
    ${weekKeys.length?detail('Счётчики по неделям',weekKeys.map(k=>`<p class="prose">${esc(short(k.slice(6)))} · дуо-биты ${esc(state.database[k]?.duo||0)} · лупмейкеры ${esc(state.database[k]?.loopers||0)}</p>`).join('')):''}
    </div></details>`))}
    </div></div>`;
}
function recoveryAvailable(){
  try { return storage?.getItem(RECOVERY_KEY)!=null; } catch { return false; }
}
function showSheet(title,html){
  if(!sheet.open) sheetFrom=document.activeElement;
  sheetInner.innerHTML=`<div class="sheet-head"><h2 id="sheet-title">${esc(title)}</h2>${ib('close','Закрыть','close')}</div>${html}`;
  if(!sheet.open) sheet.showModal();
  sheet.scrollTop=0;
  syncViewport();
}
function closeSheet(){ if(sheet.open) sheet.close(); }
function syncViewport(){
  if(!visual || !sheet.open) return;
  sheet.style.maxHeight=Math.max(130,Math.min(760,visual.height-12,visual.height*.92))+'px';
  const keyboard=Math.max(0,window.innerHeight-visual.height-visual.offsetTop);
  sheet.style.marginBottom=keyboard>0?keyboard+'px':'';
}
visual?.addEventListener('resize',syncViewport);
visual?.addEventListener('scroll',syncViewport);
sheet.addEventListener('close',()=>{
  sheet.style.maxHeight='';
  sheet.style.marginBottom='';
  if(sheetFrom?.isConnected) sheetFrom.focus({preventScroll:true});
});
sheet.addEventListener('click',e=>{
  if(e.target!==sheet) return;
  const box=sheet.getBoundingClientRect();
  if(e.clientX<box.left || e.clientX>box.right || e.clientY<box.top || e.clientY>box.bottom) closeSheet();
});
function form(kind,body,extra=''){return `<form class="flow" data-form="${kind}" ${extra}>${body}</form>`;}
const fileInput=(title,id)=>`<label class="file-button">${esc(title)}<input type="file" id="${id}" accept=".json,application/json" aria-label="${esc(title)}"></label>`;
const reminders=[[0,'Без напоминания'],[5,'За 5 минут'],[15,'За 15 минут'],[30,'За 30 минут'],[60,'За час']];
function entrySheet(kind='task',item=null){
  const isEvent=kind==='event', editing=!!item;
  const d=item?.date||(ui.page==='calendar'?ui.date:today());
  const cat=category(item?.category||projects[ui.sub]?.name);
  const categoryPicker=`<details><summary><span>Категория</span><span class="meta" id="category-label">${cat}</span></summary><div class="chips details-content">${CATEGORIES.map(c=>`<label class="chip"><input name="category" type="radio" value="${c}" ${c===cat?'checked':''}>${c}</label>`).join('')}</div></details>`;
  const chooseKind=editing?'':`<div class="segment" role="group" aria-label="Тип записи"><button type="button" aria-pressed="${!isEvent}" ${action('entry-type','task')}>Задача</button><button type="button" aria-pressed="${isEvent}" ${action('entry-type','event')}>Событие</button></div>`;
  const repeat=select('Повтор','repeat',[['none','Без повтора'],['daily','Каждый день'],['weekly','Каждую неделю'],['biweekly','Раз в две недели']],item?.repeat||'none');
  const timeFields=`<div class="pair-fields">${field('Начало','start',item?.start||'','type="time"')}${field('Конец','end',item?.end||'','type="time"')}</div>`;
  const rem=select('Напоминание при экспорте','reminder',reminders,item?.reminder??(item?.remind?30:0));
  showSheet(editing?(isEvent?'Изменить событие':'Изменить задачу'):'Добавить',form('entry',chooseKind+
    `<input type="hidden" name="kind" value="${kind}"><input type="hidden" name="id" value="${esc(item?.id||'')}">`+
    field(editing&&isEvent?'Событие':'Название','title',item?.title??item?.text??'','required maxlength="240" placeholder="Что запланировать?"')+
    dateInput('Дата','date',d,true)+
    `<div data-entry-event class="flow" ${isEvent?'':'hidden'}>${timeFields}${repeat}<div data-repeat-end ${item?.repeat&&item.repeat!=='none'?'':'hidden'}>${dateInput('Повторять до (необязательно)','until',item?.until||'')}</div>${rem}</div>
    <div data-entry-task ${isEvent?'hidden':''}>${detail('Срок, время и длительность',dateInput('Крайний срок','due',item?.due||'')+
      number('Длительность, мин','duration',item?.duration??'','placeholder="25" max="1439"')+
      field('Начало (необязательно)','taskStart',item?.start||'','type="time"')+
      field('Конец (необязательно)','taskEnd',item?.end||'','type="time"')+
      select('Напоминание при экспорте','taskReminder',reminders,item?.reminder??(item?.remind?30:0)),!!(item?.start||item?.due&&editing))}</div>`+
    categoryPicker+
    (editing&&!isEvent?`<label class="line-label"><input type="checkbox" name="done" ${item.done?'checked':''}>Выполнено</label>`:'')+
    (editing&&isEvent&&item.repeat&&item.repeat!=='none'?'<p class="muted">Изменения применяются ко всей серии.</p>':'')+
    formEnd(editing?(isEvent?'event-delete':'task-delete'):'',item?.id,editing?'Сохранить':'Добавить')));
}
function editorType(kind){
  const fm=sheet.querySelector('form');
  const event=kind==='event';
  fm.elements.kind.value=kind;
  fm.querySelector('[data-entry-event]').hidden=!event;
  fm.querySelector('[data-entry-task]').hidden=event;
  for(const b of fm.querySelectorAll('[data-action="entry-type"]')) b.setAttribute('aria-pressed',String(b.dataset.value===kind));
}
function metricSheet(fields,d){
  const day=dayOf(d);
  const controls=fields.map(key=>key==='wake'||key==='bed'?field(trackerLabels[key],key,day[key]||'','type="time"'):number(trackerLabels[key],key,day[key]??''));
  showSheet(fields.length===1?trackerLabels[fields[0]]:'Показатели дня',form('metrics',
    `<p class="muted">${esc(longDate(d))}</p>${controls.join('')}${fields.includes('bed')?'<p class="muted">Отбой относится к ночи после выбранного дня.</p>':''}${formEnd()}`,`data-date="${d}"`));
}
function mealSheet(id){
  const day=dayOf(ui.healthDate), m=day.meals.find(x=>String(x.id)===id);
  const current=tmin(hm(minute(new Date()))), slot=m?.slot || (current<660?'b':current<960?'l':current<1260?'d':'s');
  showSheet(m?'Изменить запись':'Записать еду',form('meal',
    `<input type="hidden" name="id" value="${esc(m?.id||'')}"><input type="hidden" name="presetVeg" value="${esc(m?.vegAuto||0)}">`+
    select('Приём пищи','slot',SLOTS.map(s=>[s.id,s.name]),slot)+
    (!m?field('Поиск по продуктам','search','','type="search" placeholder="Например, банан" autocomplete="off"')+'<div id="food-results" class="card preset-list"></div>':'')+
    field('Блюдо','name',m?.n||'','required maxlength="180" placeholder="Название блюда"')+
    `<div class="pair-fields">${number('Калории, ккал','k',m?.k??'')}${number('Белок, г','p',m?.p??'')}</div>`+
    detail('Вес, жиры и углеводы',`<div class="pair-fields">${number('Вес, г','g',m?.g??'')}${number('Жиры, г','f',m?.f??'')}${number('Углеводы, г','c',m?.c??'')}</div>`)+
    formEnd(m?'meal-delete':'',m?.id),`data-date="${ui.healthDate}"`));
  if(!m) foodResults('');
}
function foodResults(query){
  const target=document.getElementById('food-results');
  const favs=Array.isArray(state.extra.foodFavorites)?state.extra.foodFavorites:[0,1,2];
  const text=query.trim().toLocaleLowerCase('ru');
  const results=PRESETS.map((p,i)=>({...p,i})).filter(p=>text?p.n.toLocaleLowerCase('ru').includes(text):favs.includes(p.i));
  target.innerHTML=results.length?results.map(p=>`<div class="row"><button type="button" class="task-edit" ${action('preset',p.i)}><strong>${esc(p.n)}</strong><span class="meta">${p.k} ккал · ${p.p} г белка</span></button><button type="button" class="icon-button" aria-label="Избранное: ${esc(p.n)}" aria-pressed="${favs.includes(p.i)}" ${action('favorite',p.i)}>${icon('star')}</button></div>`).join(''):
    empty(text?'Совпадений нет. Можно добавить вручную.':'Поиск откроет каталог продуктов.');
}
function workoutSheet(id){
  const d=ui.healthDate, type=gymType(d), e=WORKOUTS[type].ex.find(ex=>ex.id===id);
  if(!e) return;
  const previous=previousSets(d,id), saved=dayOf(d).gym?.sets?.[id]||[];
  const old=previous?.sets.filter(s=>s?.w!=null||s?.r!=null)||[];
  const tip=old.length>=e.sets&&old.every(s=>s.r>=e.hi)?'В прошлом подходе достигнута верхняя граница повторов. Шаг веса в плане: '+e.inc+'.':'';
  showSheet(e.n,form('workout',`<p class="muted">${esc(e.tip)}</p><p class="muted">${esc(previous?'Прошлый раз, '+short(previous.date)+': '+old.map(s=>`${s.w??'—'} × ${s.r??'—'}`).join(', '):'Старт в исходной программе: '+e.start)}</p>${tip?`<p class="muted">${esc(tip)}</p>`:''}`+
    Array.from({length:Math.max(e.sets,saved.length)},(_,i)=>`<div class="set-row"><strong>${i+1}</strong>${number('Кг','w'+i,saved[i]?.w??'')}${number('Повторы','r'+i,saved[i]?.r??'')}</div>`).join('')+formEnd(),`data-date="${d}" data-value="${id}" data-workout="${type}"`));
}
function dayOptions(name,title,list){
  return `<div><p class="muted">${title}</p><div class="chips">${[1,2,3,4,5,6,0].map(w=>`<label class="chip"><input type="checkbox" name="${name}" value="${w}" ${list.includes(w)?'checked':''}>${WD[w]}</label>`).join('')}</div></div>`;
}
function regimeSheet(){
  const s=settings();
  showSheet('Режим и расписание',form('regime',dateInput('Больничный до (включительно)','hospitalUntil',s.hospitalUntil)+
    number('Дорога до университета, мин','commute',s.commute,'required max="180"')+
    dayOptions('drivingDays','Дни вождения · 19:00–21:00',s.drivingDays)+dayOptions('gymDays','Дни зала',s.gymDays)+formEnd()));
}
function goalsSheet(){
  const s=settings();
  const controls=[['Белок, г','protein'],['Овощи и фрукты, порций','veg'],['Ккал, минимум','kcalMin'],['Ккал, максимум','kcalMax'],
    ['Шаги в обычный день','steps'],['Шаги на больничном','hospitalSteps'],['Сон, минимум (ч)','sleepMin'],['Сон, максимум (ч)','sleepMax']];
  showSheet('Цели здоровья',form('goals','<p class="muted">Личные ориентиры из твоего плана. Их можно менять.</p><div class="pair-fields">'+
    controls.map(([label,key])=>number(label,key,s[key],'required')).join('')+'</div>'+formEnd()));
}
function notificationsSheet(){
  showSheet('Уведомления iPhone',`<div class="flow"><span class="tag">Через Календарь</span><p class="prose">Выбери время напоминания в задаче или событии, затем экспортируй план на 30 дней и вручную добавь его в Календарь. Изменения в GlowUp OS требуют нового экспорта.</p>
    ${button('Экспортировать .ics','export-ics',undefined,'primary')}
    <p class="muted">Web Push пока не подключён. Для фоновой доставки нужны разрешение установленного приложения и сервер, который отправит уведомление в нужное время.</p></div>`);
}
function syncSheet(){
  showSheet('Отчёт и пакет задач',form('task-import',`<p class="muted">Отчёт содержит личные записи. Перед отправкой проверь, какие сведения хочешь передать.</p>
    <div class="pair-fields">${button('Отчёт за 7 дней','report',7)}${button('Отчёт за 30 дней','report',30)}</div>
    ${textarea('Пакет задач JSON','package')}${formEnd('',undefined,'Применить задачи')}`));
}
function notify(message){
  const node=document.getElementById('toast');
  node.textContent=message; node.hidden=false;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{node.hidden=true;},4200);
}
function download(name,text,type){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const a=document.createElement('a');
  a.href=url; a.download=name;
  document.body.append(a);
  a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function jsonDownload(name,data){download(name,JSON.stringify(data,null,2),'application/json');}
async function exportCalendar(){
  const pack=calendarICS(today());
  if(!pack.entries) return notify('В ближайшие 30 дней записей нет.');
  const name='GlowUp_OS.ics', type='text/calendar';
  const file=new File([pack.text],name,{type});
  if(navigator.canShare?.({files:[file]})){
    try { await navigator.share({files:[file]}); return; }
    catch(error){ if(error.name==='AbortError') return; }
  }
  download(name,pack.text,type);
}
function report(n){
  const to=today(), from=add(to,1-n), range=d=>dateOK(d)&&d>=from&&d<=to;
  const lines=[`GLOWUP OS · ${from} — ${to}`,'','ЗАДАЧИ'];
  for(const t of tasks().filter(t=>range(t.date)&&!archival(t))) lines.push(`${t.done?'[x]':'[ ]'} ${t.date} · ${category(t.category)} · ${t.text}`);
  lines.push('','ЗАМЕТКИ');
  const noteDates=new Set([...days(),...Object.keys(state.extra.notes||{})]);
  for(const d of [...noteDates].sort().filter(range)) if(noteFor(d)) lines.push(d+' · '+noteFor(d));
  lines.push('','ЖУРНАЛ');
  for(const d of days().filter(range)) lines.push(d+(d===TEST_DAY?' (тест)':'')+' · '+JSON.stringify(dayOf(d)));
  lines.push('','ПРОДАЖИ',JSON.stringify(state.database['meta/biz']||{}));
  download('GlowUp_report_'+to+'.txt',lines.join('\n'),'text/plain;charset=utf-8');
}
function confirmDelete(kind,id){
  const details={
    task:['Удалить задачу?','Она будет убрана из плана.'],
    event:['Удалить событие?','Если у события есть повтор, удалится вся серия.'],
    meal:['Удалить запись?','Дневные итоги будут пересчитаны.']
  };
  const [title,description]=details[kind];
  showSheet(title,`<div class="flow"><p class="muted">${description}</p><div class="sheet-actions">${button('Отмена','close')}${button('Удалить','delete-confirm',kind+':'+id,'delete-button')}</div></div>`);
}
function saveEntry(f){
  const kind=f.get('kind'), id=f.get('id')||uid(), title=String(f.get('title')).trim(), date=f.get('date');
  if(!title||!dateOK(date)) throw Error('Введи название и дату.');
  const isEvent=kind==='event';
  const start=f.get(isEvent?'start':'taskStart')||'', end=f.get(isEvent?'end':'taskEnd')||'';
  const from=tmin(start), to=tmin(end);
  const duration=Number(f.get('duration'))||null;
  if((isEvent&&from===null)||(end&&(from===null||to===null||to<=from))) throw Error('Укажи начало и время окончания позже начала.');
  const defaultEnd=from===null?null:from+(duration||(isEvent?60:25));
  if(from!==null&&!end&&defaultEnd>=1440) throw Error('Выбери время окончания в пределах этого дня.');
  const remind=Number(f.get(isEvent?'reminder':'taskReminder'))||0;
  if(remind&&from===null) throw Error('Для напоминания укажи время начала.');
  const item={id,date,category:category(f.get('category')),start,end:end||(from===null?'':hm(defaultEnd)),reminder:remind,remind:!!remind};
  if(isEvent){
    const repeat=f.get('repeat'), until=repeat==='none'?'':f.get('until')||'';
    if(until&&(!dateOK(until)||until<date)) throw Error('Дата конца серии должна быть позже начала или совпадать с ним.');
    Object.assign(item,{title,repeat,until});
    mutate('events',rows=>{
      const old=rows.find(x=>String(x.id)===id);
      if(old) Object.assign(old,item); else rows.push(item);
    });
  } else {
    const due=f.get('due')||'';
    const done=f.get('done')==='on';
    if(due&&!dateOK(due)) throw Error('Проверь крайний срок.');
    mutate('extra',extra=>{
      const old=extra.tasks.find(x=>String(x.id)===id);
      Object.assign(item,{text:title,due,duration,done,completedAt:done?old?.completedAt||new Date().toISOString():null});
      if(old){
        if(archival(old)) item.archived=true;
        Object.assign(old,item);
      } else extra.tasks.push(item);
    });
  }
}
const val=(f,key)=>f.get(key)===''||f.get(key)===null?null:Number(f.get(key));
function saveMeal(f,d){
  const n=String(f.get('name')).trim();
  if(!n) throw Error('Введи название блюда.');
  const id=f.get('id')||uid(), slot=f.get('slot');
  dayWrite(d,day=>{
    const old=day.meals.find(x=>String(x.id)===id);
    const vegAuto=Number(f.get('presetVeg'))||0;
    const item={id,slot,n,k:val(f,'k')||0,p:val(f,'p')||0,f:val(f,'f')??0,c:val(f,'c')??0,g:val(f,'g'),vegAuto,at:old?.at||hm(minute(new Date()))};
    const vegDelta=vegAuto-(old?.vegAuto||0);
    if(vegDelta) day.veg=Math.max(0,(Number(day.veg)||0)+vegDelta);
    if(old) Object.assign(old,item); else day.meals.push(item);
  });
}
function saveTasksPackage(f){
  const packageText=f.get('package');
  let payload;
  try { payload=JSON.parse(packageText); }
  catch { throw Error('Проверь формат JSON.'); }
  const entries=payload?.tasks;
  if(!Array.isArray(entries)||!entries.length||entries.length>200||
    entries.some(t=>!record(t)||typeof t.text!=='string'||!t.text.trim()||t.text.length>240||
      typeof t.category!=='string'||!dateOK(t.date)||(t.due&&!dateOK(t.due))||
      (t.id!=null&&typeof t.id!=='string'))) throw Error('Нужен массив tasks с названием, датой и категорией каждой задачи (до 200).');
  mutate('extra',extra=>{
    for(const t of entries){
      const id=t.id||uid();
      const old=extra.tasks.find(x=>x.id===id);
      const update={id,text:t.text.trim(),date:t.date,category:category(t.category),due:t.due||old?.due||''};
      if(old){
        if(archival(old)) update.archived=true;
        Object.assign(old,update);
      } else extra.tasks.push({...update,done:false});
    }
  });
}
const handlers={
  nav:value=>{if(value==='calendar'&&ui.page!=='calendar'){ui.date=today();ui.filter='day';}route(value);},
  back:()=>route(ui.page),
  settings:()=>route(ui.page,'settings'),
  project:value=>route('projects',value),
  date:value=>{if(dateOK(value)){ui.date=value;ui.filter='day';draw();}},
  week:value=>{ui.date=add(ui.date,+value);ui.filter='day';draw();},
  'calendar-day':value=>{ui.date=value;ui.filter='day';route('calendar');},
  'calendar-tasks':value=>{handlers['calendar-day'](value); view.querySelector('[aria-label="Список задач"]')?.scrollIntoView({block:'center'});},
  'task-filter':value=>{ui.filter=value;draw();},
  'health-sub':value=>{if(ui.page!=='health'||!ui.sub) ui.healthDate=today();route('health',value);},
  'health-date':value=>{ui.healthDate=add(ui.healthDate,+value);draw();},
  entry:()=>entrySheet(),
  close:closeSheet,
  'entry-type':editorType,
  'task-edit':value=>{const item=tasks().find(t=>String(t.id)===value);if(item) entrySheet('task',item);},
  'event-edit':value=>{const item=state.events.find(t=>String(t.id)===value);if(item) entrySheet('event',item);},
  'task-toggle':value=>{
    mutate('extra',extra=>{
      const item=extra.tasks.find(t=>String(t.id)===value);
      if(item){item.done=!item.done;item.completedAt=item.done?new Date().toISOString():null;}
    });
    draw();
  },
  'task-delete':value=>confirmDelete('task',value),
  'event-delete':value=>confirmDelete('event',value),
  'meal-delete':value=>confirmDelete('meal',value),
  'delete-confirm':value=>{
    const i=value.indexOf(':'), kind=value.slice(0,i), id=value.slice(i+1);
    if(kind==='task') mutate('extra',extra=>{extra.tasks=extra.tasks.filter(t=>String(t.id)!==id);});
    if(kind==='event') mutate('events',events=>{const i=events.findIndex(t=>String(t.id)===id);if(i>=0) events.splice(i,1);});
    if(kind==='meal') dayWrite(ui.healthDate,day=>{
      const old=day.meals.find(m=>String(m.id)===id);
      if(old?.vegAuto) day.veg=Math.max(0,(Number(day.veg)||0)-old.vegAuto);
      day.meals=day.meals.filter(m=>String(m.id)!==id);
    });
    closeSheet(); draw(); notify('Удалено.');
  },
  note:d=>showSheet('Заметка дня',form('note',textarea('Запись', 'note',noteFor(d))+
    (dayOf(d).note&&noteFor(d)!==dayOf(d).note?detail('Запись из старого журнала',`<p class="prose">${esc(dayOf(d).note)}</p>`):'')+
    formEnd(),`data-date="${d}"`)),
  sales:()=>{
    const sales=state.database['meta/biz']||{};
    const day=dayOf(today());
    showSheet('Результаты продаж',form('sales',number('Оплаченных продаж','paid',sales.paid??0,'required')+number('Всего заработано, $','usd',sales.usd??0,'required')+
      number('Новых контактов сегодня','outreach',day.outreach??'')+formEnd()));
  },
  metrics:()=>metricSheet(['wake','bed','steps','weight','waist','pimples'],today()),
  metric:key=>metricSheet([key],ui.healthDate),
  'care-check':id=>{dayWrite(ui.healthDate,day=>{day.done[id]=!day.done[id];});draw();},
  'gym-type':type=>{dayWrite(ui.healthDate,day=>{(day.gym||={sets:{}}).type=type;});draw();},
  'gym-done':type=>{dayWrite(ui.healthDate,day=>{(day.gym||={sets:{}}).type=type;day.done.gym=!day.done.gym;});draw();},
  'gym-set':workoutSheet,
  oneoff:id=>{metadata('meta/oneoffs',o=>{if(o[id]) delete o[id];else o[id]=today();});draw();},
  meal:mealSheet,
  favorite:value=>{
    const i=+value;
    mutate('extra',extra=>{
      const saved=extra.foodFavorites||[0,1,2];
      extra.foodFavorites=saved.includes(i)?saved.filter(x=>x!==i):[...saved,i];
    });
    foodResults(sheet.querySelector('[name=search]').value);
  },
  preset:value=>{
    const p=PRESETS[+value], fm=sheet.querySelector('form');
    fm.elements.name.value=p.n; fm.elements.k.value=p.k; fm.elements.p.value=p.p;
    fm.elements.presetVeg.value=p.veg||0;
    notify('Данные блюда подставлены.');
  },
  regime:regimeSheet,
  'health-goals':goalsSheet,
  notifications:notificationsSheet,
  'export-ics':exportCalendar,
  backup:()=>{
    if(storageIssue) return handlers['raw-backup']();
    jsonDownload('GlowUp_backup_'+today()+'.json',backup());
  },
  'raw-backup':()=>jsonDownload('GlowUp_raw_'+today()+'.json',{format:'glowup-os-raw-v1',raw:rawStore()}),
  recovery:()=>jsonDownload('GlowUp_before_restore_'+today()+'.json',{format:'glowup-os-raw-v1',raw:JSON.parse(storage.getItem(RECOVERY_KEY))}),
  sync:syncSheet,
  report:n=>report(+n)
};
document.addEventListener('click',async event=>{
  const b=event.target.closest('[data-action]');
  if(!b) return;
  const fn=handlers[b.dataset.action];
  if(!fn) return;
  try { await fn(b.dataset.value); }
  catch(error) { notify(error.message||'Действие не выполнено.'); }
});
document.addEventListener('submit',event=>{
  const fm=event.target;
  const kind=fm.dataset.form;
  if(!kind) return;
  event.preventDefault();
  const f=new FormData(fm), date=fm.dataset.date, errorNode=fm.querySelector('.form-error');
  try{
    if(kind==='entry') saveEntry(f);
    if(kind==='metrics') dayWrite(date,day=>{
      for(const [key,value] of f) day[key]=key==='wake'||key==='bed'?value||null:val(f,key);
    });
    if(kind==='meal') saveMeal(f,date);
    if(kind==='workout') dayWrite(date,day=>{
      const g=day.gym||={sets:{}};
      g.type||=fm.dataset.workout;
      const sets=(g.sets||={})[fm.dataset.value]||=[];
      const count=WORKOUTS[fm.dataset.workout].ex.find(e=>e.id===fm.dataset.value).sets;
      for(let i=0;i<Math.max(count,sets.length);i++) sets[i]={...sets[i],w:val(f,'w'+i),r:val(f,'r'+i)};
    });
    if(kind==='regime') metadata('meta/settings',s=>{
      s.hospitalUntil=f.get('hospitalUntil')||''; s.commute=Math.round(val(f,'commute'));
      s.gymDays=f.getAll('gymDays').map(Number); s.drivingDays=f.getAll('drivingDays').map(Number);
    });
    if(kind==='goals'){
      if(val(f,'kcalMin')>val(f,'kcalMax')||val(f,'sleepMin')>val(f,'sleepMax')||val(f,'sleepMax')>24)
        throw Error('Проверь минимальные и максимальные значения.');
      metadata('meta/settings',s=>{for(const [key] of f) s[key]=val(f,key);});
    }
    if(kind==='note') mutate('extra',extra=>{(extra.notes||={})[date]=f.get('note');});
    if(kind==='sales') mutate('database',db=>{
      const biz=db['meta/biz']||={};
      biz.paid=Math.floor(val(f,'paid')); biz.usd=val(f,'usd');
      if(f.get('outreach')!=='' || db['days/'+today()]?.outreach!=null)
        (db['days/'+today()]||={done:{},meals:[]}).outreach=val(f,'outreach');
    });
    if(kind==='task-import') saveTasksPackage(f);
    closeSheet();draw();notify(kind==='task-import'?'Задачи обновлены.':'Сохранено.');
  }catch(error){
    errorNode.textContent=error.message||'Изменения не сохранены.';
    errorNode.scrollIntoView({block:'nearest'});
  }
});
document.addEventListener('input',event=>{
  const x=event.target;
  if(x.name==='search'&&x.closest('#sheet')) foodResults(x.value);
  if(x.name==='name'&&x.form?.dataset.form==='meal') x.form.elements.presetVeg.value='0';
});
document.addEventListener('change',async event=>{
  const x=event.target;
  if(x.name==='jump-date') handlers.date(x.value);
  if(x.name==='category'&&x.checked){
    document.getElementById('category-label').textContent=x.value;
    x.closest('details').open=false;
  }
  if(x.name==='repeat') x.form.querySelector('[data-repeat-end]').hidden=x.value==='none';
  if(x.id!=='restore-file'||!x.files.length) return;
  try {
    const b=JSON.parse(await x.files[0].text());
    if(!record(b)||!['glowup-os-backup-v1','glowup-os-backup-v2','glowup-os-raw-v1'].includes(b.format)) throw Error('Выбери JSON-копию GlowUp OS.');
    const v1=b.format==='glowup-os-backup-v1';
    showSheet('Восстановить данные?',`<div class="flow"><p class="prose">${v1?'Копия 4.0 заменит журналы, задачи и заметки. События, которые уже есть здесь, сохранятся.':'Текущие журналы, задачи, заметки и события будут заменены. Перед заменой приложение сохранит локальный снимок.'}</p><p class="form-error" role="alert"></p><div class="sheet-actions">${button('Отмена','close')}<button type="button" class="primary" id="confirm-restore">Восстановить</button></div></div>`);
    document.getElementById('confirm-restore').addEventListener('click',()=>{
      try { restoreBackup(b);closeSheet();draw();notify('Данные восстановлены.'); }
      catch(error){sheet.querySelector('.form-error').textContent=error.message;}
    });
  }catch(error){notify(error.message||'Файл не распознан.');}
  x.value='';
});
function refresh(){
  if(document.hidden || ui.page!=='today'||ui.sub||sheet.open) return;
  const now=new Date(), sig=ymd(now)+'/'+minute(now);
  if(sig===focusSignature) return;
  if(view.contains(document.activeElement)&&document.activeElement!==view) return;
  focusSignature=sig;
  draw();
}
window.addEventListener('storage',event=>{
  if(event.key!==null&&!Object.values(KEYS).includes(event.key)) return;
  readStorage();
  if(!sheet.open) draw();
});
document.addEventListener('visibilitychange',refresh);
window.addEventListener('focus',refresh);
setInterval(refresh,15000);
draw();
if('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('./sw.js').catch(()=>{});
