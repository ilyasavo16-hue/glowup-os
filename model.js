'use strict';

const KEYS = {
  database: 'glowup_os_v2_database',
  extra: 'glowup_os_v2_extra',
  events: 'glowup_os_v4_events'
};
const SAFETY_KEY = 'glowup_os_v5_before_update';
const RECOVERY_KEY = 'glowup_os_v5_before_import';
const TEST_DAY = '2026-11-08';
const DEFAULTS = {
  hospitalUntil: '2026-11-10', gymDays: [1,3,5], drivingDays: [1,3], commute: 45,
  protein: 125, kcalMin: 2200, kcalMax: 2400, veg: 3, steps: 9000,
  hospitalSteps: 5000, sleepMin: 7.5, sleepMax: 9
};
const SEEDS = [
  {id:'goal-codex', category:'Бизнес', text:'Настроить агентов Codex', date:'2026-11-08', due:'2026-11-15', duration:45},
  {id:'goal-guide', category:'Бизнес', text:'Закончить методичку продаж', date:'2026-11-08', due:'2026-11-15', duration:30},
  {id:'goal-review', category:'Бизнес', text:'Сверить ответы агентов с методичкой', date:'2026-11-12', due:'2026-11-15', duration:30},
  {id:'goal-fatt', category:'Музыка', text:'Поработать над битами для Fatt Mack', date:'2026-11-08', due:'2026-12-31', duration:30},
  {id:'goal-sale', category:'Бизнес', text:'Довести один диалог до оплаченной продажи', date:'2026-11-08', due:'2026-12-31', duration:25}
];
const CATEGORIES = ['Личное','Учёба','Музыка','Бизнес','Здоровье'];
const WD = ['вс','пн','вт','ср','чт','пт','сб'];
const pad = n => String(n).padStart(2,'0');
const ymd = d => [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
const parse = d => new Date(d+'T12:00:00');
const today = () => ymd(new Date());
const wd = d => parse(d).getDay();
const add = (d,n) => { const day=parse(d); day.setDate(day.getDate()+n); return ymd(day); };
const diff = (a,b) => Math.round((Date.parse(a)-Date.parse(b))/86400000);
const mondayOf = d => add(d,-((wd(d)+6)%7));
const tmin = t => typeof t==='string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(t) ? Number(t.slice(0,2))*60+Number(t.slice(3)) : null;
const hm = m => pad(Math.floor(m/60))+':'+pad(m%60);
const minute = d => d.getHours()*60+d.getMinutes();
const dateOK = d => typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && ymd(parse(d))===d;
const uid = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+Math.random().toString(36).slice(2);
const clone = v => JSON.parse(JSON.stringify(v));
const record = v => v !== null && typeof v==='object' && !Array.isArray(v);
const category = c => c==='Агент' || c==='Агенты' || c==='Агенты Codex' ? 'Бизнес' : c==='Уход' ? 'Здоровье' : CATEGORIES.includes(c) ? c : 'Личное';
const archival = t => t.archived || LEGACY_TASKS.some(old => old.id===t.id && old.text===t.text);
const initial = {database:{},extra:{tasks:[],notes:{}},events:[]};
let state, storageIssue, storage;
function validSection(section,v) {
  if(section==='events') return Array.isArray(v) && v.every(record);
  if(!record(v)) return false;
  if(section==='extra') return Array.isArray(v.tasks) && v.tasks.every(record) && (v.notes==null || record(v.notes));
  return Object.entries(v).every(([key,row]) => !key.startsWith('days/') ||
    (record(row) && (row.done==null || record(row.done)) &&
      (row.meals==null || Array.isArray(row.meals) && row.meals.every(record))));
}
function readStorage() {
  const result=clone(initial);
  try {
    storage=globalThis.localStorage;
    for(const [section,key] of Object.entries(KEYS)){
      const raw=storage.getItem(key);
      if(raw===null) continue;
      try {
        const value=JSON.parse(raw);
        if(!validSection(section,value)) throw Error('format');
        result[section]=value;
      } catch { throw Error('Не удалось прочитать сохранённые данные. Скачай исходную копию в настройках.'); }
    }
    storageIssue='';
  } catch(error) {
    storageIssue=storage ? error.message : 'Хранилище недоступно. Проверь настройки браузера.';
  }
  state=result;
}
function rawStore() {
  return Object.fromEntries(Object.entries(KEYS).map(([section,key])=>[section,storage.getItem(key)]));
}
function backUpBeforeWrite() {
  const raw=rawStore();
  if(Object.values(raw).some(v=>v!==null) && storage.getItem(SAFETY_KEY)===null)
    storage.setItem(SAFETY_KEY,JSON.stringify(raw));
}
function commit(changes,{restore=false}={}) {
  if(storageIssue && !restore) throw Error(storageIssue);
  const old=rawStore();
  for(const [section,value] of Object.entries(changes)) {
    if(!validSection(section,value)) throw Error('Неподходящий формат данных');
  }
  if(restore) storage.setItem(RECOVERY_KEY,JSON.stringify(old));
  else backUpBeforeWrite();
  const written=[];
  try {
    for(const [section,value] of Object.entries(changes)){
      storage.setItem(KEYS[section],JSON.stringify(value));
      written.push(section);
    }
  } catch(error) {
    for(const section of written) {
      if(old[section]===null) storage.removeItem(KEYS[section]);
      else storage.setItem(KEYS[section],old[section]);
    }
    throw error;
  }
  Object.assign(state,changes);
  if(restore) readStorage();
}
function mutate(section,fn){
  readStorage();
  if(storageIssue) throw Error(storageIssue);
  const value=clone(state[section]);
  if(section==='extra' && !value.seededV5){
    const ids=new Set(value.tasks.map(t=>t.id));
    value.tasks.push(...SEEDS.filter(t=>!ids.has(t.id)).map(clone));
    value.seededV5=true;
  }
  fn(value);
  commit({[section]:value});
}
function settings(){return {...DEFAULTS,...state.database['meta/settings']};}
function days(){return Object.keys(state.database).filter(k=>k.startsWith('days/') && dateOK(k.slice(5))).map(k=>k.slice(5)).sort();}
function dayOf(d){
  const day=state.database['days/'+d]||{};
  return {...day,done:day.done||{},meals:day.meals||[]};
}
function dayWrite(d,fn){
  mutate('database',db=>{
    const key='days/'+d;
    const day=db[key] ||= {};
    day.done ||= {};
    day.meals ||= [];
    fn(day);
  });
}
function metadata(key,fn){mutate('database',db=>fn(db[key] ||= {}));}
function tasks(){
  const list=state.extra.tasks;
  if(state.extra.seededV5) return list;
  const ids=new Set(list.map(t=>t.id));
  return list.concat(SEEDS.filter(t=>!ids.has(t.id)));
}
function backup(){
  return {format:'glowup-os-backup-v2', ...clone(state), exportedAt:new Date().toISOString()};
}
function restoreBackup(b){
  if(!record(b)) throw Error('Файл резервной копии не распознан');
  if(b.format==='glowup-os-raw-v1'){
    if(!record(b.raw) || Object.keys(KEYS).some(k=>!(k in b.raw))) throw Error('Исходная копия повреждена');
    const values=Object.fromEntries(Object.keys(KEYS).map(k=>[k,b.raw[k]===null?clone(initial[k]):JSON.parse(b.raw[k])]));
    commit(values,{restore:true});
    return;
  }
  if(b.format!=='glowup-os-backup-v1' && b.format!=='glowup-os-backup-v2') throw Error('Выбери JSON-копию GlowUp OS');
  const changes={database:b.database,extra:b.extra};
  if(b.format==='glowup-os-backup-v2') changes.events=b.events;
  commit(changes,{restore:true});
}
function weekKind(d){
  const weeks=diff(mondayOf(d),'2026-10-26')/7;
  return weeks%2===0?'num':'den';
}
const dayTT = d => TT[weekKind(d)][wd(d)];
const inHospital = d => !!settings().hospitalUntil && d<=settings().hospitalUntil;
const home = d => !inHospital(d);
const on = list => d=>list.includes(wd(d));
const onHome = list => d=>home(d)&&list.includes(wd(d));
const always = () => true;
const isGymDay = d => home(d) && settings().gymDays.includes(wd(d));
const isBodyDay = d => d>='2026-11-15' && diff(d,'2026-11-15')%14===0;
const stepsTarget = d => settings()[inHospital(d)?'hospitalSteps':'steps'];
const sumOf = (d,f) => (d.meals||[]).reduce((n,m)=>n+(+m[f]||0),0);
const weekAlc = d => Array.from({length:7},(_,i)=>Number(dayOf(add(mondayOf(d),i)).alc)||0).reduce((a,b)=>a+b,0);
const short = d => dateOK(d)?parse(d).toLocaleDateString('ru',{day:'numeric',month:'short'}):'Без даты';
const longDate = d => parse(d).toLocaleDateString('ru',{weekday:'long',day:'numeric',month:'long'});
const fmtN = n => n==null?'':String(n).replace('.',',');
function gymType(d){
  const current=dayOf(d).gym?.type;
  if(WORKOUTS[current]) return current;
  const previous=days().reverse().find(x=>x<d && x!==TEST_DAY && Object.values(dayOf(x).gym?.sets||{}).some(sets=>Array.isArray(sets)&&sets.some(s=>s?.w!=null||s?.r!=null)));
  return previous && dayOf(previous).gym.type==='A'?'B':'A';
}
function previousSets(d,id){
  for(const date of days().reverse()){
    if(date>=d || date===TEST_DAY) continue;
    const sets=dayOf(date).gym?.sets?.[id];
    if(Array.isArray(sets)&&sets.some(s=>s?.w!=null||s?.r!=null)) return {date,sets};
  }
}
function firstAttended(d){
  const pair=home(d)&&dayTT(d)?.pairs.find(p=>!p.skip);
  return pair?tmin(PAIR_T[pair.n][0]):null;
}
function wakeTarget(d){
  const base=d<='2026-11-11'?600:d<='2026-11-18'?570:540;
  const first=firstAttended(d);
  return hm(first===null?base:Math.max(0,Math.min(base,first-settings().commute-45)));
}
function sleepFor(d){
  const bed=tmin(dayOf(add(d,-1)).bed), wake=tmin(dayOf(d).wake);
  if(bed===null || wake===null) return null;
  return ((wake-bed+1440)%1440)/60;
}
function isDone(t,d,day){
  if(t.id==='wake') return tmin(day.wake)!==null && tmin(day.wake)<=tmin(wakeTarget(d));
  if(t.kind==='auto') return t.test(d,day);
  if(t.kind==='count') return (+day[t.field]||0)>=settings().veg;
  if(t.kind==='number' && t.target) return day[t.field]!=null && day[t.field]>=t.target(d);
  if(t.field) return day[t.field]!=null && day[t.field]!=='';
  return !!day.done?.[t.id];
}
function healthScore(d) {
  const items=TASKS.filter(t=>!t.opt&&t.show(d));
  return {done:items.filter(t=>isDone(t,d,dayOf(d))).length,total:items.length};
}
function occurs(e,d){
  if(!dateOK(e.date) || d<e.date || (dateOK(e.until)&&d>e.until)) return false;
  if(d===e.date) return true;
  const gap=diff(d,e.date);
  return e.repeat==='daily' || (e.repeat==='weekly'&&gap%7===0) || (e.repeat==='biweekly'&&gap%14===0);
}
function agenda(d) {
  const out=[];
  const push=(title,start,end,type,props={})=> {
    if(start===null || end===null || start>=end) return;
    out.push({title,start,end,type,...props});
  };
  const pairs=home(d)?dayTT(d)?.pairs.filter(p=>!p.skip)||[]:[];
  for(const p of pairs) push(p.s,...PAIR_T[p.n].map(tmin),'pair',{sub:[p.k,p.room].filter(Boolean).join(' · '),id:'pair-'+p.n,category:'Учёба'});
  const commute=settings().commute;
  if(pairs.length && commute>0) {
    const first=tmin(PAIR_T[pairs[0].n][0]), last=tmin(PAIR_T[pairs.at(-1).n][1]);
    push('Дорога в университет',Math.max(0,first-commute),first,'trip',{id:'trip-out'});
    push('Дорога из университета',last,Math.min(1439,last+commute),'trip',{id:'trip-in'});
  }
  if(home(d) && settings().drivingDays.includes(wd(d))) push('Вождение',1140,1260,'drive',{id:'drive'});
  for(const e of state.events.filter(e=>occurs(e,d))) push(e.title,tmin(e.start),tmin(e.end),'event',{id:e.id,category:category(e.category),entry:e});
  for(const t of tasks().filter(t=>!archival(t)&&t.date===d&&t.start)) {
    const start=tmin(t.start);
    push(t.text,start,tmin(t.end)??(start===null?null:Math.min(1439,start+(+t.duration||25))),'task',{id:t.id,category:category(t.category),entry:t});
  }
  return out.sort((a,b)=>a.start-b.start||a.end-b.end);
}
const blocksTime = e => e.type!=='task' || !e.entry.done;
function overlaps(list,index){
  const event=list[index];
  return blocksTime(event) && list.some((e,i)=>index!==i && blocksTime(e) && e.start<event.end && e.end>event.start);
}
function gaps(list,from=420,to=1380){
  const out=[];
  let cursor=from;
  for(const e of list.filter(blocksTime)){
    if(e.end<=cursor) continue;
    if(e.start>=to) break;
    if(e.start>cursor) out.push([cursor,e.start]);
    cursor=Math.max(cursor,e.end);
  }
  if(cursor<to) out.push([cursor,to]);
  return out;
}
function gymWindows(d){
  if(!home(d)) return [];
  const events=agenda(d);
  return (GYM_OPEN[wd(d)]||[]).flatMap(([start,end])=>gaps(events,start,end)).filter(([a,b])=>b-a>=60);
}
function gymWinText(d){return gymWindows(d).map(([a,b])=>hm(a)+'–'+hm(b)).join(', ');}
function orderedTasks(list){
  return [...list].sort((a,b)=>Number(!!a.done)-Number(!!b.done)||
    String(a.due||'9999').localeCompare(String(b.due||'9999'))||String(a.date||'').localeCompare(String(b.date||'')));
}
function focus(now=new Date()){
  const d=ymd(now), m=minute(now), list=agenda(d).filter(blocksTime);
  const current=list.filter(e=>e.start<=m&&m<e.end);
  if(current.length) return {kind:'current',event:current[0],count:current.length};
  const next=list.find(e=>e.start>m);
  if(m<420 || m>=1380) return {kind:'night',next};
  const end=Math.min(next?.start??1380,1380);
  if(next && next.start-m<=20) return {kind:'next',event:next};
  const planned=new Set(list.filter(e=>e.type==='task'&&e.end>m).map(e=>e.id));
  const eligible=orderedTasks(tasks().filter(t=>!archival(t)&&!t.done&&dateOK(t.date)&&t.date<=d&&
    (!t.start || t.date<d || !planned.has(t.id)) && (+t.duration||25)<=end-m));
  const urgent=eligible.find(t=>dateOK(t.due)&&diff(t.due,d)<=1);
  const day=dayOf(d), care=m<660&&!day.done?.am?'am':m>=1260&&!day.done?.pm?'pm':null;
  if(urgent || eligible[0]) return {kind:'task',task:urgent||eligible[0],end,next};
  if(care) return {kind:'care',care,end,next};
  return {kind:'free',end,next};
}
function foldICS(line){
  const encoder=new TextEncoder();
  const pieces=[];
  let piece='', bytes=0;
  for(const char of line){
    const size=encoder.encode(char).length;
    if(bytes+size>75){pieces.push(piece);piece=' ';bytes=1;}
    piece+=char;
    bytes+=size;
  }
  pieces.push(piece);
  return pieces.join('\r\n');
}
function calendarICS(from,count=30){
  const clean=v=>String(v??'').replace(/\\/g,'\\\\').replace(/\r?\n|\r/g,'\\n').replace(/[,;]/g,'\\$&');
  const fmt=(d,t)=>d.replaceAll('-','')+'T'+hm(t).replace(':','')+'00';
  const stamp=new Date().toISOString().replace(/[-:]|\.\d{3}/g,'');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GlowUp OS//RU','CALSCALE:GREGORIAN'];
  let entries=0;
  for(let i=0;i<count;i++){
    const d=add(from,i);
    for(const e of agenda(d).filter(blocksTime)){
      const reminder=Number(e.entry?.reminder)||(e.entry?.remind?30:0);
      lines.push('BEGIN:VEVENT','UID:'+clean(e.type+'-'+e.id+'-'+d)+'@glowup-os','DTSTAMP:'+stamp,
        'DTSTART:'+fmt(d,e.start),'DTEND:'+fmt(d,e.end),'SUMMARY:'+clean(e.title));
      if(e.sub) lines.push('DESCRIPTION:'+clean(e.sub));
      if(reminder>0) lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+clean(e.title),'TRIGGER:-PT'+reminder+'M','END:VALARM');
      lines.push('END:VEVENT');
      entries++;
    }
    for(const t of tasks().filter(t=>t.date===d&&!t.done&&!t.start&&!archival(t))){
      lines.push('BEGIN:VEVENT','UID:'+clean('task-'+t.id+'-'+d)+'@glowup-os','DTSTAMP:'+stamp,
        'DTSTART;VALUE=DATE:'+d.replaceAll('-',''),'DTEND;VALUE=DATE:'+add(d,1).replaceAll('-',''),'SUMMARY:'+clean(t.text),'END:VEVENT');
      entries++;
    }
  }
  lines.push('END:VCALENDAR');
  return {entries,text:lines.map(foldICS).join('\r\n')+'\r\n'};
}
var TASKS=[
  {id:'wake',g:'morning',kind:'time',field:'wake',label:function(d){return 'Подъём до '+wakeTarget(d);},sub:function(d,day){var f=firstAttended(d);var s=f!=null?'первая пара в '+hm(f):'';if(day.wake)s=(tmin(day.wake)<=tmin(wakeTarget(d))?'в цель':'позже цели')+(s?' · '+s:'');return s||'впиши, во сколько встал';},show:always},
  {id:'am',g:'morning',label:'Утренние процедуры в ванной',more:['Душ: голова шампунем, кондиционер только на длину, вода тёплая','Зубы и скребок для языка','Лицо: Effaclar гель → Азелик → Effaclar H','Бритьё шейвером — раз в 1–2 дня, на сухое лицо','Укладка: солевой спрей, 2–3 минуты фена от корней, паста не на лоб, потом вымыть руки','Бальзам для губ, гель для бровей, дезодорант'],show:always},
  {id:'light',g:'morning',label:'10–15 минут дневного света',sub:function(){return 'в первый час после подъёма';},show:always},
  {id:'supps',g:'morning',label:'Добавки',more:['Цинктерал — по схеме дерматолога','D3 2000 МЕ','Омега-3','Креатин 5 г'],show:home},
  {id:'nosweets',g:'day',label:'Без сладкого к чаю',show:always},
  {id:'nomilk',g:'day',label:'Без молока и йогурта',show:always},
  {id:'coffee',g:'day',label:'Кофе и энергетики только до 15:00',show:always},
  {id:'protein',g:'day',kind:'auto',label:'Белок',sub:function(d,day){var p=sumOf(day,'p');return 'по дневнику еды: '+p+' г';},test:function(d,day){return sumOf(day,'p')>=settings().protein;},show:always},
  {id:'veg',g:'day',kind:'count',field:'veg',target:3,label:'Овощи и фрукты, порций',sub:function(){return 'цель '+settings().veg+'+';},show:always},
  {id:'steps',g:'day',kind:'number',field:'steps',label:'Шаги',sub:function(d){return 'цель '+stepsTarget(d).toLocaleString('ru-RU');},target:stepsTarget,ph:'0',show:always},
  {id:'pm',g:'evening',label:'Вечерние процедуры',more:['Умыть лицо и лоб: Effaclar гель → Effaclar H','Через 30 минут — Аклиф тонким слоем, мимо глаз, губ и складок у носа','Нить или ирригатор → зубы → скребок','Бальзам на ночь, крем для рук','Протереть экран телефона'],show:always},
  {id:'screens',g:'evening',label:'Последние 30 минут без телефона',sub:function(){return 'зарядка вне кровати';},show:always},
  {id:'bed',g:'evening',kind:'time',field:'bed',opt:true,label:'Лёг спать в',sub:function(){return 'для подсчёта сна';},show:always},
  {id:'pillow',g:'sched',label:'Сменить наволочку',show:on([1,4])},
  {id:'weigh',g:'sched',kind:'number',field:'weight',unit:'кг',ph:'78,0',label:'Взвеситься утром',show:on([1,4])},
  {id:'drydry',g:'sched',label:'Dry Dry на ночь на сухие подмышки',show:onHome([0,3])},
  {id:'gym',g:'sched',label:function(d){return 'Зал: тренировка '+(gymType(d)==='A'?'А':'Б');},sub:function(d){var w=gymWinText(d);return w?'окна: '+w:'проверь расписание';},show:isGymDay},
  {id:'bigcare',g:'sched',label:'Большой уход',more:['Маска для волос — на длину, не у линии роста, лоб потом умыть','Ногти на руках, заусенцы — кусачками; на ногах — раз в 2–3 недели','Брови пинцетом — только отросшее за границей','Нос, уши, шея сзади — триммером','Почистить шейвер','Свежее полотенце для лица'],show:onHome([0])},
  {id:'photo',g:'sched',label:'Фото прогресса',more:['Днём у того же окна, без вспышки и фильтров','Анфас, правая и левая щека под 45°, правый профиль','Волосы убраны со лба, лицо без выражения'],show:on([0])},
  {id:'pimples',g:'sched',kind:'number',field:'pimples',unit:'шт.',ph:'0',label:'Новых прыщей за неделю',show:on([0])},
  {id:'body',g:'sched',kind:'number',field:'waist',unit:'см',ph:'0',label:'Фото тела и талия по пупку',show:function(d){return home(d)&&isBodyDay(d);}}
];

readStorage();
