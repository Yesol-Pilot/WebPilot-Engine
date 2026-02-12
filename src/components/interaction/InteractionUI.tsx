import { useInteraction } from './InteractionManager';


/**
 * InteractionUI
 * 
 * 현재 상호작용 중인 객체(Active Object)의 이름과 가능한 행동(Affordances)을
 * 화면 중앙 하단에 오버레이로 표시합니다.
 */
export default function InteractionUI() {
    const { activeObjectId, registeredObjects, executeAction, setActiveObject } = useInteraction();

    // 활성 객체가 없으면 아무것도 렌더링하지 않음
    if (!activeObjectId || !registeredObjects[activeObjectId]) return null;

    const object = registeredObjects[activeObjectId];

    return (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 
                        bg-black/90 text-white p-6 rounded-xl border border-white/10 
                        backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-4 min-w-[300px]
                        animate-in slide-in-from-bottom-5 fade-in duration-300">

            {/* Header: 객체 이름 및 닫기 버튼 */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-display">
                        {object.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-mono">Interactable Object</p>
                </div>
                <button
                    onClick={() => setActiveObject(null)}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    aria-label="Close interaction menu"
                >
                    ✕
                </button>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
                {object.affordances.map(action => (
                    <button
                        key={action}
                        onClick={() => executeAction(activeObjectId, action)}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 
                                   border border-white/10 hover:border-white/30
                                   rounded-lg text-sm font-bold uppercase tracking-wider
                                   transition-all active:scale-95 flex items-center justify-center gap-2
                                   group"
                    >
                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors">▶</span>
                        {action.replace('_', ' ')}
                    </button>
                ))}
            </div>
        </div>
    );
}
