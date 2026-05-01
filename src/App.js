import React, { useState, useEffect } from 'react';
import './App.css';

// Exercise Library
const exerciseLibrary = {
  Chest: ['Bench Press', 'Incline Press', 'Dumbbell Press', 'Cable Fly', 'Push Ups', 'Chest Dips'],
  Back: ['Pull Ups', 'Lat Pulldown', 'Barbell Row', 'Dumbbell Row', 'Seated Row', 'Face Pull', 'Deadlift'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Fly', 'Arnold Press', 'Shrugs'],
  Legs: ['Squat', 'Front Squat', 'Leg Press', 'RDL', 'Leg Extension', 'Leg Curl', 'Lunges', 'Calf Raises'],
  Arms: ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Pushdown', 'Skull Crushers', 'Overhead Extension'],
  Core: ['Plank', 'Leg Raises', 'Russian Twists', 'Cable Crunch', 'Hanging Knee Raises']
};

// Pre-defined split templates
const splitTemplates = {
  'Push Pull Legs': {
    type: 'ppl',
    days: [
      { name: 'Push Day', exercises: ['Bench Press', 'Overhead Press', 'Triceps Pushdown'] },
      { name: 'Pull Day', exercises: ['Pull Ups', 'Barbell Row', 'Barbell Curl'] },
      { name: 'Legs Day', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raises'] }
    ]
  },
  'Upper Lower': {
    type: 'ul',
    days: [
      { name: 'Upper A', exercises: ['Bench Press', 'Pull Ups', 'Overhead Press', 'Barbell Row'] },
      { name: 'Lower A', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raises'] },
      { name: 'Upper B', exercises: ['Incline Press', 'Lat Pulldown', 'Lateral Raises', 'Barbell Curl'] },
      { name: 'Lower B', exercises: ['Deadlift', 'Front Squat', 'Leg Extension', 'Leg Curl'] }
    ]
  },
  'Full Body': {
    type: 'fb',
    days: [
      { name: 'Full Body A', exercises: ['Squat', 'Bench Press', 'Pull Ups', 'Overhead Press', 'Barbell Row'] },
      { name: 'Full Body B', exercises: ['Deadlift', 'Incline Press', 'Pull Ups', 'Lateral Raises', 'Leg Press'] },
      { name: 'Full Body C', exercises: ['Front Squat', 'Dumbbell Press', 'Rows', 'Dips', 'Leg Curl'] }
    ]
  },
  'Bro Split': {
    type: 'bro',
    days: [
      { name: 'Chest Day', exercises: ['Bench Press', 'Incline Press', 'Cable Fly', 'Dips'] },
      { name: 'Back Day', exercises: ['Pull Ups', 'Barbell Row', 'Lat Pulldown', 'Seated Row'] },
      { name: 'Shoulder Day', exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Fly'] },
      { name: 'Leg Day', exercises: ['Squat', 'Leg Press', 'Leg Extension', 'Leg Curl', 'Calf Raises'] },
      { name: 'Arm Day', exercises: ['Barbell Curl', 'Triceps Pushdown', 'Hammer Curl', 'Skull Crushers'] }
    ]
  }
};

// Vector Icons - Updated
const IconWorkout = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4L8 6" />
    <path d="M18 4L16 6" />
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M8 10H16" />
    <path d="M8 14H12" />
    <circle cx="17" cy="10" r="1.5" />
    <circle cx="17" cy="14" r="1.5" />
  </svg>
);

const IconSplits = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6H21" />
    <path d="M8 12H21" />
    <path d="M8 18H21" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="4" cy="18" r="1.5" />
  </svg>
);

const IconHistory = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
    <path d="M4 4L6 6" />
  </svg>
);

const IconBack = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3L21 7L7 21H3V17L17 3Z" />
    <path d="M14 6L18 10" />
  </svg>
);

const IconDelete = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7H20" />
    <path d="M10 11V16" />
    <path d="M14 11V16" />
    <path d="M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7" />
    <path d="M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" />
  </svg>
);

const IconUse = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconSun = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2V4" />
    <path d="M12 20V22" />
    <path d="M4.93 4.93L6.34 6.34" />
    <path d="M17.66 17.66L19.07 19.07" />
    <path d="M2 12H4" />
    <path d="M20 12H22" />
    <path d="M6.34 17.66L4.93 19.07" />
    <path d="M19.07 4.93L17.66 6.34" />
  </svg>
);

const IconMoon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  
  const [page, setPage] = useState('home');
  const [splits, setSplits] = useState(() => {
    const saved = localStorage.getItem('splits');
    if (saved) return JSON.parse(saved);
    const defaultSplits = {};
    Object.keys(splitTemplates).forEach(templateName => {
      const template = splitTemplates[templateName];
      const id = template.type;
      defaultSplits[id] = {
        id: id,
        name: templateName,
        type: template.type,
        days: template.days.map((day, idx) => ({
          id: Date.now().toString() + idx,
          name: day.name,
          exercises: day.exercises.map((ex, exIdx) => ({
            id: Date.now().toString() + idx + exIdx,
            name: ex,
            sets: 3,
            reps: '8-12'
          }))
        }))
      };
    });
    return defaultSplits;
  });
  
  const [activeSplitId, setActiveSplitId] = useState(() => {
    return localStorage.getItem('activeSplit') || 'ppl';
  });
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingSplit, setEditingSplit] = useState(null);
  const [showPicker, setShowPicker] = useState(null);
  const [activeLog, setActiveLog] = useState(null);
  const [modals, setModals] = useState({ addSplit: false, addDay: false, delete: null, customSplit: false });
  const [newSplitType, setNewSplitType] = useState('');
  const [newDayName, setNewDayName] = useState('');
  const [customSplitName, setCustomSplitName] = useState('');
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  
  const getSortedSplits = () => {
    const order = ['fb', 'bro', 'ul', 'ppl'];
    const splitList = Object.values(splits);
    const customSplits = splitList.filter(s => !order.includes(s.type));
    const orderedSplits = order.map(key => splits[key]).filter(Boolean);
    return [...orderedSplits, ...customSplits];
  };
  
  useEffect(() => {
    localStorage.setItem('splits', JSON.stringify(splits));
  }, [splits]);
  
  useEffect(() => {
    localStorage.setItem('activeSplit', activeSplitId);
  }, [activeSplitId]);
  
  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);
  
  const activeSplit = splits[activeSplitId];
  const hasActiveSplit = activeSplit && Object.keys(splits).length > 0;
  
  const getToday = () => {
    if (!hasActiveSplit || !activeSplit?.days.length) return null;
    const idx = (new Date().getDay() - 1 + activeSplit.days.length) % activeSplit.days.length;
    return activeSplit.days[idx];
  };
  
  const today = getToday();
  
  const addSplitFromTemplate = () => {
    if (!newSplitType) return;
    const template = splitTemplates[newSplitType];
    const id = template.type;
    if (splits[id]) {
      setModals({ ...modals, addSplit: false });
      setNewSplitType('');
      return;
    }
    const newSplit = {
      id: id,
      name: newSplitType,
      type: template.type,
      days: template.days.map((day, idx) => ({
        id: Date.now().toString() + idx,
        name: day.name,
        exercises: day.exercises.map((ex, exIdx) => ({
          id: Date.now().toString() + idx + exIdx,
          name: ex,
          sets: 3,
          reps: '8-12'
        }))
      }))
    };
    setSplits({ ...splits, [id]: newSplit });
    setActiveSplitId(id);
    setNewSplitType('');
    setModals({ ...modals, addSplit: false });
  };
  
  const addCustomSplit = () => {
    if (!customSplitName.trim()) return;
    const id = 'custom_' + Date.now();
    const newSplit = {
      id: id,
      name: customSplitName,
      type: 'custom',
      days: []
    };
    setSplits({ ...splits, [id]: newSplit });
    setActiveSplitId(id);
    setEditingSplit(newSplit);
    setCustomSplitName('');
    setModals({ ...modals, addSplit: false, customSplit: false });
  };
  
  const deleteSplit = (id) => {
    const newSplits = { ...splits };
    delete newSplits[id];
    setSplits(newSplits);
    if (activeSplitId === id) {
      const firstSplit = Object.keys(newSplits)[0];
      setActiveSplitId(firstSplit || null);
    }
    setModals({ ...modals, delete: null });
  };
  
  const updateSplit = (split) => {
    setSplits({ ...splits, [split.id]: split });
    setEditingSplit(null);
  };
  
  const addDay = () => {
    if (!newDayName.trim()) return;
    const newSplit = { ...editingSplit };
    newSplit.days.push({ id: Date.now().toString(), name: newDayName, exercises: [] });
    setEditingSplit(newSplit);
    setNewDayName('');
    setModals({ ...modals, addDay: false });
  };
  
  const deleteDay = (dayId) => {
    const newSplit = { ...editingSplit };
    newSplit.days = newSplit.days.filter(d => d.id !== dayId);
    setEditingSplit(newSplit);
    setModals({ ...modals, delete: null });
  };
  
  const updateDayName = (dayId, name) => {
    const newSplit = { ...editingSplit };
    const day = newSplit.days.find(d => d.id === dayId);
    if (day) day.name = name;
    setEditingSplit(newSplit);
  };
  
  const addExercise = (dayId, exerciseName) => {
    const newSplit = { ...editingSplit };
    const day = newSplit.days.find(d => d.id === dayId);
    if (day) {
      day.exercises.push({
        id: Date.now().toString(),
        name: exerciseName,
        sets: 3,
        reps: '8-12'
      });
    }
    setEditingSplit(newSplit);
    setShowPicker(null);
  };
  
  const deleteExercise = (dayId, exerciseId) => {
    const newSplit = { ...editingSplit };
    const day = newSplit.days.find(d => d.id === dayId);
    if (day) day.exercises = day.exercises.filter(e => e.id !== exerciseId);
    setEditingSplit(newSplit);
    setModals({ ...modals, delete: null });
  };
  
  const updateExercise = (dayId, exerciseId, field, value) => {
    const newSplit = { ...editingSplit };
    const day = newSplit.days.find(d => d.id === dayId);
    const ex = day?.exercises.find(e => e.id === exerciseId);
    if (ex) ex[field] = field === 'sets' ? parseInt(value) || 0 : value;
    setEditingSplit(newSplit);
  };
  
  const startLog = (workout) => {
    setActiveLog({
      ...workout,
      date: new Date().toISOString(),
      splitName: activeSplit.name,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: Array(ex.sets).fill().map(() => ({ weight: '', reps: '', done: false }))
      }))
    });
  };
  
  const updateLog = (exIdx, setIdx, field, value) => {
    const newLog = { ...activeLog };
    newLog.exercises[exIdx].sets[setIdx][field] = value;
    setActiveLog(newLog);
  };
  
  const toggleDone = (exIdx, setIdx) => {
    const newLog = { ...activeLog };
    newLog.exercises[exIdx].sets[setIdx].done = !newLog.exercises[exIdx].sets[setIdx].done;
    setActiveLog(newLog);
  };
  
  const saveLog = () => {
    setLogs([activeLog, ...logs]);
    setActiveLog(null);
    setPage('history');
  };
  
  if (activeLog) {
    return (
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <header className="app-header">
          <div className="header-left">
            <div className="app-title">SPLT</div>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
        </header>
        <div className="log-container">
          <div className="log-header">
            <button onClick={() => setActiveLog(null)} className="back-btn"><IconBack /></button>
            <h2>{activeLog.name}</h2>
          </div>
          {activeLog.exercises.map((ex, exIdx) => (
            <div key={ex.id} className="log-card">
              <h3>{ex.name}</h3>
              {ex.sets.map((set, setIdx) => (
                <div key={setIdx} className="log-row">
                  <span className="set-label">Set {setIdx + 1}</span>
                  <input type="number" placeholder="Weight" value={set.weight} onChange={e => updateLog(exIdx, setIdx, 'weight', e.target.value)} />
                  <input type="number" placeholder="Reps" value={set.reps} onChange={e => updateLog(exIdx, setIdx, 'reps', e.target.value)} />
                  <button className={`check ${set.done ? 'done' : ''}`} onClick={() => toggleDone(exIdx, setIdx)}>
                    {set.done && <IconCheck />}
                    {!set.done && <span className="circle">○</span>}
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button className="save-btn" onClick={saveLog}>Save Workout</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <div className="header-left">
          <div className="app-title">SPLT</div>
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>
      </header>
      
      <div className="main-content">
        {page === 'home' && (
          <div className="home-page">
            <div className="search-card">
              <div className="search-label">Active Split</div>
              <select value={activeSplitId || ''} onChange={e => setActiveSplitId(e.target.value)} className="split-select">
                {Object.keys(splits).length === 0 ? (
                  <option value="">No splits available</option>
                ) : (
                  Object.values(splits).map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
            </div>
            
            {!hasActiveSplit || Object.keys(splits).length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">+</div>
                <h3>No Active Split</h3>
                <p>Create a workout split to get started</p>
                <button className="primary-btn" onClick={() => setModals({ ...modals, addSplit: true })}>Create Split</button>
              </div>
            ) : !today ? (
              <div className="empty-card">
                <div className="empty-icon">○</div>
                <h3>No Days Added</h3>
                <p>Add days to your {activeSplit.name} split</p>
                <button className="primary-btn" onClick={() => {
                  setEditingSplit(JSON.parse(JSON.stringify(activeSplit)));
                  setPage('splits');
                }}>Edit Split</button>
              </div>
            ) : (
              <div className="journey-card">
                <div className="journey-header">
                  <span className="journey-label">TODAY'S WORKOUT</span>
                  <span className="price-badge">{activeSplit.name}</span>
                </div>
                <div className="journey-title">{today.name}</div>
                
                <div className="route-info">
                  {today.exercises.map((ex, idx) => (
                    <div key={ex.id} className={`route-stop ${idx === today.exercises.length - 1 ? 'last' : ''}`}>
                      <div className="stop-dot" />
                      <div className="stop-info">
                        <div className="stop-name">{ex.name}</div>
                        <div className="stop-time">{ex.sets} sets × {ex.reps} reps</div>
                      </div>
                      <div className="stop-price">{ex.sets * 10}</div>
                    </div>
                  ))}
                </div>
                
                <button className="search-btn" onClick={() => startLog(today)}>Start Workout →</button>
              </div>
            )}
          </div>
        )}
        
        {page === 'splits' && !editingSplit && (
          <div className="splits-page">
            <div className="page-header">
              <h2>Splits</h2>
              <button className="see-all" onClick={() => setModals({ ...modals, addSplit: true })}>+ New</button>
            </div>
            
            {Object.keys(splits).length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">📋</div>
                <h3>No Splits Yet</h3>
                <p>Create your first workout split</p>
                <button className="primary-btn" onClick={() => setModals({ ...modals, addSplit: true })}>Create Split</button>
              </div>
            ) : (
              <div className="splits-list">
                {getSortedSplits().map(split => (
                  <div key={split.id} className="split-card">
                    <div className="split-info">
                      <div className="split-name">{split.name}</div>
                      <div className="split-location">{split.days.length} days</div>
                    </div>
                    <div className="split-actions">
                      {split.id === activeSplitId && <span className="active-tag">Active</span>}
                      <button onClick={() => setEditingSplit(JSON.parse(JSON.stringify(split)))} className="icon-btn"><IconEdit /></button>
                      <button onClick={() => setModals({ ...modals, delete: { type: 'split', id: split.id } })} className="icon-btn"><IconDelete /></button>
                      {split.id !== activeSplitId && (
                        <button className="use-split-btn" onClick={() => setActiveSplitId(split.id)}><IconUse /> Use</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {page === 'splits' && editingSplit && (
          <div className="edit-page">
            <div className="page-header">
              <button onClick={() => setEditingSplit(null)} className="back-btn"><IconBack /></button>
              <input value={editingSplit.name} onChange={e => setEditingSplit({ ...editingSplit, name: e.target.value })} className="edit-title" />
              <button className="see-all" onClick={() => setModals({ ...modals, addDay: true })}><IconPlus /> Day</button>
            </div>
            
            {editingSplit.days.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">○</div>
                <h3>No Days Yet</h3>
                <p>Add days to your split</p>
              </div>
            ) : (
              editingSplit.days.map(day => (
                <div key={day.id} className="day-card">
                  <div className="day-header">
                    <input value={day.name} onChange={e => updateDayName(day.id, e.target.value)} className="day-input" />
                    <button onClick={() => setModals({ ...modals, delete: { type: 'day', id: day.id } })} className="icon-btn"><IconDelete /></button>
                  </div>
                  
                  {day.exercises.map(ex => (
                    <div key={ex.id} className="exercise-edit-row">
                      <input value={ex.name} onChange={e => updateExercise(day.id, ex.id, 'name', e.target.value)} className="ex-input" />
                      <div className="ex-details">
                        <input type="number" value={ex.sets} onChange={e => updateExercise(day.id, ex.id, 'sets', e.target.value)} className="small-input" />
                        <span>x</span>
                        <input value={ex.reps} onChange={e => updateExercise(day.id, ex.id, 'reps', e.target.value)} className="reps-input" />
                        <button onClick={() => setModals({ ...modals, delete: { type: 'exercise', dayId: day.id, id: ex.id } })} className="icon-btn"><IconDelete /></button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="add-exercise-btn" onClick={() => setShowPicker(day.id)}>
                    <IconPlus /> Add Exercise
                  </button>
                </div>
              ))
            )}
            
            <button className="save-split-btn" onClick={() => updateSplit(editingSplit)}>Save Changes</button>
          </div>
        )}
        
        {page === 'history' && (
          <div className="history-page">
            <div className="page-header">
              <h2>History</h2>
            </div>
            {logs.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">○</div>
                <h3>No Workouts Yet</h3>
                <p>Complete a workout to see it here</p>
                <button className="primary-btn" onClick={() => setPage('home')}>Go to Home</button>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="history-card">
                  <div className="history-header">
                    <div>
                      <span className="history-split">{log.splitName}</span>
                      <span className="history-workout">{log.name}</span>
                    </div>
                    <div className="history-date">{new Date(log.date).toLocaleDateString()}</div>
                  </div>
                  {log.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="history-exercise">
                      <div className="history-ex-name">{ex.name}</div>
                      <div className="history-sets">
                        {ex.sets.map((set, setIdx) => (
                          set.weight && set.reps && (
                            <span key={setIdx} className="history-set-badge">{set.weight}×{set.reps}</span>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation - Updated with new icons */}
      <nav className="bottom-nav">
        <button className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <IconWorkout />
          <span>Workout</span>
        </button>
        <button className={`nav-item ${page === 'splits' ? 'active' : ''}`} onClick={() => setPage('splits')}>
          <IconSplits />
          <span>Splits</span>
        </button>
        <button className={`nav-item ${page === 'history' ? 'active' : ''}`} onClick={() => setPage('history')}>
          <IconHistory />
          <span>History</span>
        </button>
      </nav>
      
      {/* Modals - same as before */}
      {modals.addSplit && (
        <div className="modal" onClick={() => setModals({ ...modals, addSplit: false, customSplit: false })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Create Split</h3>
            
            {!modals.customSplit ? (
              <>
                <div className="template-list">
                  {Object.keys(splitTemplates).map(templateName => (
                    <button key={templateName} className="template-option" onClick={() => {
                      setNewSplitType(templateName);
                      addSplitFromTemplate();
                    }}>
                      <span>{templateName}</span>
                      <span className="template-days">{splitTemplates[templateName].days.length} days</span>
                    </button>
                  ))}
                  <button className="template-option custom-option" onClick={() => setModals({ ...modals, customSplit: true })}>
                    <span>Custom Split</span>
                    <span className="template-days">Create your own</span>
                  </button>
                </div>
                <button className="modal-close" onClick={() => setModals({ ...modals, addSplit: false })}>Cancel</button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  placeholder="Enter split name" 
                  value={customSplitName} 
                  onChange={e => setCustomSplitName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addCustomSplit()}
                  autoFocus
                />
                <div className="modal-buttons">
                  <button className="modal-cancel" onClick={() => setModals({ ...modals, customSplit: false })}>Back</button>
                  <button className="modal-confirm" onClick={addCustomSplit}>Create</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {modals.addDay && (
        <div className="modal" onClick={() => setModals({ ...modals, addDay: false })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add Day</h3>
            <input type="text" placeholder="Day name" value={newDayName} onChange={e => setNewDayName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addDay()} autoFocus />
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setModals({ ...modals, addDay: false })}>Cancel</button>
              <button className="modal-confirm" onClick={addDay}>Add</button>
            </div>
          </div>
        </div>
      )}
      
      {modals.delete && (
        <div className="modal" onClick={() => setModals({ ...modals, delete: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete?</h3>
            <p>This cannot be undone.</p>
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setModals({ ...modals, delete: null })}>Cancel</button>
              <button className="modal-delete" onClick={() => {
                const d = modals.delete;
                if (d.type === 'split') deleteSplit(d.id);
                else if (d.type === 'day') deleteDay(d.id);
                else if (d.type === 'exercise') deleteExercise(d.dayId, d.id);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {showPicker && (
        <div className="modal" onClick={() => setShowPicker(null)}>
          <div className="modal-content picker-modal" onClick={e => e.stopPropagation()}>
            <h3>Add Exercise</h3>
            <div className="exercise-groups">
              {Object.keys(exerciseLibrary).map(group => (
                <div key={group}>
                  <div className="group-header">{group}</div>
                  {exerciseLibrary[group].map(ex => (
                    <div key={ex} className="exercise-option" onClick={() => addExercise(showPicker, ex)}>{ex}</div>
                  ))}
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowPicker(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
