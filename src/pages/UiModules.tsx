import { useState } from 'react';
import { 
  Check, Copy, Search, Plus, Settings, Trash2, Edit, Download, Upload, 
  ChevronDown, ChevronUp, X, AlertCircle, CheckCircle, Info, Loader2,
  ExternalLink, Eye, EyeOff, Calendar, Filter, MoreVertical, Sparkles, Home, Zap
} from 'lucide-react';
import { Header } from '../components/Header';
import { TiltCard } from '../components/ui/TiltCard';
import { IridescentButton } from '../components/ui/IridescentButton';

export function UiModules() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkboxStates, setCheckboxStates] = useState({ option1: true, option2: false, option3: false });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const sections = [
    { id: 'iridescent-buttons', label: 'Iridescent Buttons' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'badges', label: 'Badges' },
    { id: 'cards', label: 'Cards' },
    { id: 'tilt-cards', label: '3D Tilt Cards' },
    { id: 'tables', label: 'Tables' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'dialogs', label: 'Dialogs/Modals' },
    { id: 'popovers', label: 'Popovers' },
    { id: 'tooltips', label: 'Tooltips' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'loading', label: 'Loading States' },
    { id: 'empty', label: 'Empty States' },
    { id: 'forms', label: 'Forms' },
    { id: 'pagination', label: 'Pagination' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <Header title="UI Modules" timeRange="7" onTimeRangeChange={() => {}} />

      <main className="p-8">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Quick Nav:</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Theme Tokens */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Theme Tokens</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-16 bg-emerald-600 rounded-lg"></div>
                <p className="text-xs font-mono text-gray-600">Primary: #059669</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-gray-900 rounded-lg"></div>
                <p className="text-xs font-mono text-gray-600">Gray 900: #111827</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-gray-50 border border-gray-200 rounded-lg"></div>
                <p className="text-xs font-mono text-gray-600">Gray 50: #F9FAFB</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-blue-600 rounded-lg"></div>
                <p className="text-xs font-mono text-gray-600">Blue: #2563EB</p>
              </div>
            </div>
          </section>

          {/* Iridescent Buttons */}
          <section id="iridescent-buttons" className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Iridescent Glass Buttons</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Glassmorphism buttons with iridescent glow effects, perfect for navigation and dark mode UIs.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard('<IridescentButton>Label</IridescentButton>', 'iridescent')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'iridescent' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'iridescent' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">States & Variants</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Hover to see the iridescent glow and sheen sweep effect. Click to see the press animation.
                </p>
                
                {/* Dark background showcase */}
                <div className="bg-gray-950 rounded-xl p-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <IridescentButton icon={<Home className="w-4 h-4" />}>
                      Default Button
                    </IridescentButton>
                    
                    <IridescentButton active icon={<Sparkles className="w-4 h-4" />}>
                      Active State
                    </IridescentButton>
                    
                    <IridescentButton icon={<Settings className="w-4 h-4" />}>
                      With Icon
                    </IridescentButton>
                    
                    <IridescentButton icon={<Zap className="w-4 h-4" />}>
                      Hover Me
                    </IridescentButton>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Text Overflow Handling</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Long labels are automatically truncated with ellipsis.
                </p>
                
                <div className="bg-gray-950 rounded-xl p-8">
                  <div className="max-w-xs space-y-4">
                    <IridescentButton icon={<AlertCircle className="w-4 h-4" />}>
                      This is a very long button label that should be truncated with ellipsis
                    </IridescentButton>
                    
                    <IridescentButton active icon={<CheckCircle className="w-4 h-4" />}>
                      Another extremely long label to demonstrate text overflow behavior in this component
                    </IridescentButton>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Navigation Example</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Perfect for sidebar navigation items. Active state indicates current page.
                </p>
                
                <div className="bg-gray-950 rounded-xl p-8">
                  <div className="max-w-xs space-y-2">
                    <IridescentButton active icon={<Home className="w-4 h-4" />}>
                      Dashboard
                    </IridescentButton>
                    
                    <IridescentButton icon={<Settings className="w-4 h-4" />}>
                      Settings
                    </IridescentButton>
                    
                    <IridescentButton icon={<Search className="w-4 h-4" />}>
                      Search
                    </IridescentButton>
                    
                    <IridescentButton icon={<Plus className="w-4 h-4" />}>
                      Create New
                    </IridescentButton>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Usage Example</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import { IridescentButton } from '../components/ui/IridescentButton';
import { Home } from 'lucide-react';

// Basic usage
<IridescentButton icon={<Home />}>
  Dashboard
</IridescentButton>

// Active state
<IridescentButton active icon={<Home />}>
  Dashboard
</IridescentButton>

// As link
<IridescentButton as="a" href="/dashboard" icon={<Home />}>
  Dashboard
</IridescentButton>

// With custom className
<IridescentButton className="my-custom-class" icon={<Home />}>
  Dashboard
</IridescentButton>`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Iridescent rainbow gradient glow on hover (purple → blue → green → orange → pink)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Animated sheen sweep effect on hover</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Drop shadow "aura" that intensifies on hover and active state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Glassmorphism background with backdrop blur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Keyboard navigation support with focus-visible ring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Respects prefers-reduced-motion for accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Automatic text truncation with ellipsis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Can render as button or link (a tag)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section id="buttons" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Buttons</h2>
              <button
                onClick={() => copyToClipboard('<button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Button</button>', 'button')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'button' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'button' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Primary Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                    Primary
                  </button>
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                    Small Primary
                  </button>
                  <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-base font-semibold hover:bg-emerald-700 transition-colors">
                    Large Primary
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    With Icon
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Secondary Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Secondary
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Outlined
                  </button>
                  <button className="px-4 py-2 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    Ghost
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Destructive & States</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">
                    Disabled
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Icon Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Inputs */}
          <section id="inputs" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Inputs</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Input</label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">With Icon</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Error State</label>
                <input
                  type="text"
                  placeholder="Invalid input"
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disabled</label>
                <input
                  type="text"
                  placeholder="Disabled input"
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Dropdown</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer">
                  <option>Select an option...</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Textarea</label>
                <textarea
                  placeholder="Enter longer text..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </section>

          {/* Badges */}
          <section id="badges" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Badges</h2>
              <button
                onClick={() => copyToClipboard('<span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Badge</span>', 'badge')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'badge' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'badge' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    Approved
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    In Progress
                  </span>
                  <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Review
                  </span>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Blocked
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    Inactive
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Success
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Error
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Pill Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                    Category
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                    Tag
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-lg">
                    Label
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Count Badges</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Notifications</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                      5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Messages</span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                      12
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section id="cards" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Cards</h2>
              <button
                onClick={() => copyToClipboard('<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">Card content</div>', 'card')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'card' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'card' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
                <p className="text-sm text-gray-600">
                  This is a simple card with a title and some content. Perfect for displaying information.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clickable Card</h3>
                <p className="text-sm text-gray-600">
                  Hover over me! I have a subtle shadow transition.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-emerald-50 border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Card with Header</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600">
                    This card has a distinct header section with a different background.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card with Footer</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This card has actions in the footer.
                  </p>
                </div>
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                    Save
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl border border-emerald-600 p-6 shadow-sm text-white">
                <h3 className="text-lg font-semibold mb-2">Colored Card</h3>
                <p className="text-sm text-emerald-50">
                  Cards can have colored backgrounds for emphasis.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-emerald-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Highlighted Card
                </h3>
                <p className="text-sm text-gray-600">
                  Use a colored border to highlight important cards.
                </p>
              </div>
            </div>
          </section>

          {/* 3D Tilt Cards */}
          <section id="tilt-cards" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">3D Tilt Cards (Apple TV Style)</h2>
              <button
                onClick={() => copyToClipboard('<TiltCard><div className="p-6">Card content</div></TiltCard>', 'tiltcard')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'tiltcard' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'tiltcard' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Interactive 3D Tilt Effect</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Hover over these cards to see the Apple TV-style 3D tilt effect with glare. The cards rotate based on your mouse position.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TiltCard>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Premium Card</h3>
                      <p className="text-sm text-emerald-50">
                        Hover to see the 3D tilt effect with glare overlay.
                      </p>
                    </div>
                  </TiltCard>

                  <TiltCard>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">With Icon</h3>
                      </div>
                      <p className="text-sm text-purple-50">
                        Interactive 3D perspective on mouse movement.
                      </p>
                    </div>
                  </TiltCard>

                  <TiltCard>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Dynamic Glare</h3>
                      <p className="text-sm text-blue-50">
                        The glare follows your mouse cursor for realism.
                      </p>
                    </div>
                  </TiltCard>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Without Glare</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TiltCard glare={false}>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Glare Effect</h3>
                      <p className="text-sm text-gray-600">
                        Set <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">glare={'{false}'}</code> to disable the glare overlay.
                      </p>
                    </div>
                  </TiltCard>

                  <TiltCard glare={false} rotationLimit={15}>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Higher Rotation</h3>
                      <p className="text-sm text-orange-50">
                        Increased <code className="px-1.5 py-0.5 bg-orange-700 rounded text-xs">rotationLimit={'{15}'}</code> for more dramatic tilt.
                      </p>
                    </div>
                  </TiltCard>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Usage Example</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <pre className="text-xs text-gray-800 overflow-x-auto">
{`import { TiltCard } from '../components/ui/TiltCard';

<TiltCard rotationLimit={8} glare={true}>
  <div className="p-6">
    Your card content here
  </div>
</TiltCard>`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Tables */}
          <section id="tables" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tables</h2>
              <button
                onClick={() => copyToClipboard('<table className="w-full"><thead>...</thead><tbody>...</tbody></table>', 'table')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'table' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'table' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Premium Table Style</h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap">
                          Name
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          Status
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150">
                        <td className="py-4 px-6 whitespace-nowrap relative border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150">
                          <span className="text-sm font-semibold text-gray-900">John Doe</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">Jan 14, 2026</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150">
                        <td className="py-4 px-6 whitespace-nowrap relative border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150">
                          <span className="text-sm font-semibold text-gray-900">Jane Smith</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Pending
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">Jan 13, 2026</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="group relative hover:bg-gray-50/80 cursor-pointer transition-all duration-150">
                        <td className="py-4 px-6 whitespace-nowrap relative border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150">
                          <span className="text-sm font-semibold text-gray-900">Bob Johnson</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            Inactive
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">Jan 12, 2026</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Table Loading Skeleton</h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-6">Name</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section id="tabs" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tabs</h2>
              <button
                onClick={() => copyToClipboard('<div className="flex border-b border-gray-200">...</div>', 'tabs')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'tabs' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'tabs' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Underline Tabs</h3>
                <div className="flex border-b border-gray-200">
                  {['overview', 'details', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                        activeTab === tab
                          ? 'text-emerald-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Content for <span className="font-semibold">{activeTab}</span> tab
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Pill Tabs</h3>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg inline-flex">
                  {['All', 'Active', 'Pending'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'All'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Dialogs/Modals */}
          <section id="dialogs" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dialogs/Modals</h2>
              <button
                onClick={() => copyToClipboard('<dialog className="...">Modal content</dialog>', 'modal')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {copiedSnippet === 'modal' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'modal' ? 'Copied!' : 'Copy Usage'}
              </button>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Open Modal
            </button>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Modal Title</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      This is a modal dialog. It overlays the page content and requires user action.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Popovers */}
          <section id="popovers" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popovers & Dropdowns</h2>
            
            <div className="relative inline-block">
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                Open Popover
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPopover && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg z-10 p-4 animate-in fade-in duration-150">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Popover Title</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    This is a popover with contextual information or actions.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPopover(false)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Tooltips */}
          <section id="tooltips" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tooltips</h2>
            
            <div className="flex flex-wrap gap-4">
              <div className="group relative">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Hover me
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  This is a tooltip
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <div className="group relative">
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="Settings">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Settings
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Alerts */}
          <section id="alerts" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alerts & Toasts</h2>
            
            <div className="space-y-4 max-w-2xl">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-emerald-900 mb-1">Success</h4>
                  <p className="text-sm text-emerald-700">Your changes have been saved successfully.</p>
                </div>
                <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Information</h4>
                  <p className="text-sm text-blue-700">Here's some helpful information for you.</p>
                </div>
                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">Warning</h4>
                  <p className="text-sm text-yellow-700">Please review this before proceeding.</p>
                </div>
                <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
                </div>
                <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Loading States */}
          <section id="loading" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Loading States</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Spinners</h3>
                <div className="flex flex-wrap gap-6 items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    Loading...
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Card Skeleton</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Empty States */}
          <section id="empty" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Empty States</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Clear Filters
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                <p className="text-sm text-gray-500 mb-4">Get started by creating your first item</p>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Item
                </button>
              </div>
            </div>
          </section>

          {/* Forms */}
          <section id="forms" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Forms</h2>
            
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Checkboxes</h3>
                <div className="space-y-3">
                  {Object.entries(checkboxStates).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setCheckboxStates(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Checkbox {key.slice(-1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Radio Buttons</h3>
                <div className="space-y-3">
                  {['Option A', 'Option B', 'Option C'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-group"
                        className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Full Form Example</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
                  </div>
                  <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          <section id="pagination" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagination</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-600">
                  Showing 1 to 25 of 100 results
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 mr-2">Page 1 of 4</span>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                    Next
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows per page:</label>
                <select className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
