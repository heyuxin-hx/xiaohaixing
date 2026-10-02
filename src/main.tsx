import { StrictMode, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './styles.css'

type Memory = { id: number; title: string; category: string; date: string; note: string; status: 'inbox' | 'organized' }
const seed: Memory[] = [
  { id: 1, title: '给生活留一点慢下来的空间', category: '人物收藏', date: '2026-09-28', note: '喜欢这段关于留白的表达。', status: 'inbox' },
  { id: 2, title: '小狗第一次学会等门', category: '狗狗成长', date: '2026-09-22', note: '它比想象中更有耐心了。', status: 'organized' },
]

function Shell({ children, count }: { children: ReactNode; count: number }) {
  const location = useLocation()
  return <div className="app-shell"><header><Link className="brand" to="/">一颗星星 <span>个人记忆工作台</span></Link><nav><Link className={location.pathname === '/' ? 'active' : ''} to="/">待整理 <b>{count}</b></Link><Link className={location.pathname === '/timeline' ? 'active' : ''} to="/timeline">时间线</Link></nav><Link className="profile" to="/login">我的空间</Link></header>{children}<footer>把值得留下的，好好放在这里。</footer></div>
}

function Login() { return <main className="center"><div className="paper card"><span className="eyebrow">PRIVATE SPACE</span><h1>欢迎回来</h1><p>这是你的私人记忆工作台。第一版先在本地记录，之后再接入云端保存。</p><button onClick={() => history.back()}>进入工作台</button></div></main> }

function Dashboard() {
  const [memories, setMemories] = useState(seed); const [editing, setEditing] = useState<Memory | null>(null); const [showAdd, setShowAdd] = useState(false)
  const inbox = memories.filter(m => m.status === 'inbox')
  const update = (m: Memory) => { setMemories(xs => xs.map(x => x.id === m.id ? m : x)); setEditing(null) }
  return <Shell count={inbox.length}><main className="page"><div className="intro"><div><span className="eyebrow">THIS WEEK</span><h1>先把想留下的，放进来。</h1><p>每周整理一点，把散落的内容变成自己的记忆。</p></div><button onClick={() => setShowAdd(true)}>＋ 新增记忆</button></div><section className="section-head"><div><span className="eyebrow">INBOX</span><h2>待整理 <small>{inbox.length} 条</small></h2></div><p>先保存，等有空再补充。</p></section><div className="memory-grid">{inbox.length ? inbox.map(m => <MemoryCard key={m.id} memory={m} onEdit={setEditing} onOrganize={() => update({ ...m, status: 'organized' })} />) : <div className="empty card"><span>✦</span><h3>这里暂时很安静</h3><p>看到值得留下的内容，就从这里开始。</p><button onClick={() => setShowAdd(true)}>保存第一条记忆</button></div>}</div>{(showAdd || editing) && <Editor memory={editing} onClose={() => { setShowAdd(false); setEditing(null) }} onSave={m => { if (editing) update(m); else { setMemories(xs => [{ ...m, id: Date.now() }, ...xs]); setShowAdd(false) } }} />}</main></Shell>
}

function MemoryCard({ memory, onEdit, onOrganize }: { memory: Memory; onEdit: (m: Memory) => void; onOrganize: () => void }) { return <article className="card memory-card"><div className="card-top"><span className="tag">{memory.category}</span><span>{memory.date}</span></div><h3>{memory.title}</h3><p>{memory.note}</p><div className="actions"><button className="text-button" onClick={() => onEdit(memory)}>编辑</button><button className="text-button primary" onClick={onOrganize}>完成整理 →</button></div></article> }
function Editor({ memory, onClose, onSave }: { memory: Memory | null; onClose: () => void; onSave: (m: Memory) => void }) { const [title, setTitle] = useState(memory?.title || ''); const [note, setNote] = useState(memory?.note || ''); const [category, setCategory] = useState(memory?.category || '人物收藏'); const [date, setDate] = useState(memory?.date || '2026-10-01'); return <div className="overlay"><form className="modal card" onSubmit={e => { e.preventDefault(); onSave({ id: memory?.id || 0, title: title || '未命名记忆', note, category, date, status: memory?.status || 'inbox' }) }}><button type="button" className="close" onClick={onClose}>×</button><span className="eyebrow">NEW MEMORY</span><h2>{memory ? '整理这条记忆' : '保存一条记忆'}</h2><label>标题<input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="它是什么？" /></label><label>分类<select value={category} onChange={e => setCategory(e.target.value)}><option>人物收藏</option><option>狗狗成长</option></select></label><label>日期<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><label>我的感受<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="为什么想留下它？" /></label><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>取消</button><button type="submit">保存到待整理</button></div></form></div> }

function Timeline() { return <Shell count={1}><main className="page"><div className="intro"><div><span className="eyebrow">MEMORY LANE</span><h1>慢慢翻看，曾经喜欢过的。</h1><p>按日期回到那些值得留下的时刻。</p></div></div><div className="timeline">{seed.filter(m => m.status === 'organized').map(m => <article className="timeline-item" key={m.id}><time>{m.date}</time><div className="card"><span className="tag">{m.category}</span><h3>{m.title}</h3><p>{m.note}</p></div></article>)}</div></main></Shell> }
function App() { return <Routes><Route path="/login" element={<Login />} /><Route path="/timeline" element={<Timeline />} /><Route path="*" element={<Dashboard />} /></Routes> }
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>)
