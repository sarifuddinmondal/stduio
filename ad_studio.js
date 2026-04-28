<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ckart India | Ad Studio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <style>
        body { background-color: #0f172a; color: #f8fafc; }
        .cell-card { transition: all 0.3s ease; }
        .cell-card:hover { border-color: #6366f1; transform: translateY(-2px); }
        .ad-preview-container {
            background: #1e293b;
            border: 2px solid #334155;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        #preview-outer-container {
            background-image: radial-gradient(#334155 1px, transparent 1px);
            background-size: 20px 20px;
        }
        textarea::-webkit-scrollbar { width: 5px; }
        textarea::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    </style>
</head>
<body class="h-screen flex flex-col">

    <header class="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
        <div class="flex items-center gap-4">
            <h1 class="text-lg font-bold text-indigo-400">CKART STUDIO</h1>
            <div class="h-6 w-[1px] bg-slate-700"></div>
            <div class="flex bg-slate-800 rounded-lg p-1 gap-1">
                <button id="workplace-toggle" class="px-4 py-1 rounded-md text-sm font-medium transition bg-indigo-600 text-white">Editor</button>
                <button id="liveview-toggle" class="px-4 py-1 rounded-md text-sm font-medium transition text-slate-400 hover:text-white">Live View</button>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <select id="preview-device-select" class="bg-slate-800 border-none rounded-md text-xs px-3 py-1.5 outline-none">
                <option value="responsive">Responsive</option>
                <option value="mobile">Mobile (375x667)</option>
                <option value="desktop">Desktop (1024x768)</option>
            </select>
            <button id="save-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-1.5 rounded-md text-sm font-bold transition flex items-center gap-2">
                <i data-lucide="save" class="w-4 h-4"></i> SAVE PROJECT
            </button>
        </div>
    </header>

    <main id="main-content" class="flex-1 grid grid-cols-2 overflow-hidden">
        
        <section id="workspace-pane" class="border-r border-slate-800 flex flex-col bg-slate-950">
            <div class="p-4 border-b border-slate-800 flex gap-2">
                <button id="add-html-btn" class="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg title="Add HTML Code">
                    <i data-lucide="code-2" class="text-indigo-400"></i>
                </button>
                <label class="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg cursor-pointer">
                    <i data-lucide="image" class="text-green-400"></i>
                    <input type="file" id="image-upload-input" accept="image/*" class="hidden">
                </label>
                <label class="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg cursor-pointer">
                    <i data-lucide="video" class="text-red-400"></i>
                    <input type="file" id="video-upload-input" accept="video/*" class="hidden">
                </label>
                <button id="add-frame-btn" class="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg" title="Add Layer Frame">
                    <i data-lucide="layers" class="text-yellow-400"></i>
                </button>
            </div>

            <form id="ad-form" class="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
                <input type="hidden" id="ad-id">
                <div class="col-span-2">
                    <label class="text-xs text-slate-500 uppercase font-bold">Project Name</label>
                    <input type="text" id="ad_name" placeholder="Summer Sale 2024" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold">Preset</label>
                    <select id="ad_preset" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                        <option value="custom">Custom</option>
                        <option value="center_window">Center Window</option>
                        <option value="fullscreen">Full Screen</option>
                        <option value="bottom_banner">Bottom Banner</option>
                        <option value="bottom_right_popup">Bottom Right Pop</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold">Position</label>
                    <select id="ad_position" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                        <option value="center">Center</option>
                        <option value="top_center">Top Center</option>
                        <option value="bottom_center">Bottom Center</option>
                        <option value="bottom_right">Bottom Right</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold">Size (Width/Height)</label>
                    <div class="flex gap-2">
                        <input type="text" id="ad_width" placeholder="70%" class="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                        <input type="text" id="ad_height" placeholder="60%" class="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                    </div>
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold">Duration (Sec)</label>
                    <input type="number" id="ad_duration" value="5" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                </div>
                <div class="col-span-2">
                    <label class="text-xs text-slate-500 uppercase font-bold">Target Pincodes</label>
                    <input type="text" id="pincodes" placeholder="741401, 700001" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1 outline-none">
                </div>
                <input type="hidden" id="serial_number">

                <div class="col-span-2 mt-4">
                    <label class="text-xs text-slate-500 uppercase font-bold">Content Layers</label>
                    <div id="cells-wrapper" class="flex flex-col gap-3 mt-2"></div>
                    <div id="workspace-placeholder" class="text-center py-10 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                        No content added. Use toolbar to add HTML, Image or Video.
                    </div>
                </div>
            </form>
        </section>

        <section id="preview-outer-container" class="relative flex items-center justify-center p-10 overflow-hidden bg-slate-900">
            <div id="preview-container" class="relative shadow-2xl transition-all duration-500 bg-black">
                <div id="ad-container-wrapper" class="w-full h-full relative">
                    </div>
            </div>
            
            <div id="liveview-controls" class="absolute bottom-6 flex gap-3 hidden">
                <button id="liveview-add-frame-btn" class="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <i data-lucide="plus"></i> Add Overlay
                </button>
                <button id="liveview-save-btn" class="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hidden">
                    <i data-lucide="check"></i> Confirm Position
                </button>
            </div>
        </section>
    </main>

    <script>
        // --- 1. Supabase Initialization ---
        const _supabaseUrl = "https://vkwxheddyagpjbsrovgh.supabase.co";
        const _supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrd3hoZWRkeWFncGpic3JvdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDM2NjEsImV4cCI6MjA5MDcxOTY2MX0.KN_JLY2owScvkGVy2inJIkEzW82_Qb2a1cavcRJFzlA";
        const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

        // --- 2. State & Variables ---
        let projectCells = [];
        let isLiveViewDraggable = false;
        let slideshowInterval = null;
        let currentSlideIndex = 0;

        // --- 3. UI Helpers ---
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            const cellsWrapper = document.getElementById('cells-wrapper');
            const adForm = document.getElementById('ad-form');
            const saveBtn = document.getElementById('save-btn');
            
            // --- 4. Core Logic: Add/Render Cells ---
            const renderWorkspaceCells = () => {
                const placeholder = document.getElementById('workspace-placeholder');
                placeholder.style.display = projectCells.length > 0 ? 'none' : 'block';
                cellsWrapper.innerHTML = '';

                projectCells.forEach(cell => {
                    const card = document.createElement('div');
                    card.className = "bg-slate-900 border border-slate-800 p-3 rounded-xl cell-card flex flex-col gap-2";
                    card.id = cell.id;

                    let inputHtml = '';
                    if(cell.type === 'html') {
                        inputHtml = `<textarea class="w-full h-24 bg-black text-green-500 p-2 text-xs font-mono rounded border border-slate-700 outline-none cell-content-input" data-id="${cell.id}">${cell.content}</textarea>`;
                    } else {
                        inputHtml = `<div class="text-xs text-slate-400 italic truncate">${cell.name}</div>`;
                    }

                    card.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold uppercase text-slate-500">${cell.type} Layer</span>
                            <button class="text-slate-500 hover:text-red-500 remove-cell-btn" data-id="${cell.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                        ${inputHtml}
                    `;
                    cellsWrapper.appendChild(card);
                });
                lucide.createIcons();
                updatePreview();
            };

            const addCell = (type, content, file = null, name = '') => {
                const newCell = {
                    id: `cell_${Date.now()}`,
                    type,
                    name: name || `${type} Layer`,
                    content,
                    file
                };
                projectCells.push(newCell);
                renderWorkspaceCells();
            };

            // --- 5. Preview System ---
            const updatePreview = () => {
                const container = document.getElementById('preview-container');
                const wrapper = document.getElementById('ad-container-wrapper');
                const device = document.getElementById('preview-device-select').value;
                const width = document.getElementById('ad_width').value || '100%';
                const height = document.getElementById('ad_height').value || '100%';
                const pos = document.getElementById('ad_position').value;

                // Device Simulation
                if (device === 'mobile') { container.style.width = '375px'; container.style.height = '667px'; }
                else if (device === 'desktop') { container.style.width = '800px'; container.style.height = '600px'; }
                else { container.style.width = '100%'; container.style.height = '100%'; }

                wrapper.innerHTML = '';
                const adBox = document.createElement('div');
                adBox.className = "ad-preview-container absolute transition-all";
                adBox.style.width = width;
                adBox.style.height = height;

                // Positioning Logic
                if(pos === 'center') { adBox.style.top = '50%'; adBox.style.left = '50%'; adBox.style.transform = 'translate(-50%, -50%)'; }
                if(pos === 'bottom_center') { adBox.style.bottom = '20px'; adBox.style.left = '50%'; adBox.style.transform = 'translateX(-50%)'; }
                if(pos === 'bottom_right') { adBox.style.bottom = '20px'; adBox.style.right = '20px'; }
                if(pos === 'top_center') { adBox.style.top = '20px'; adBox.style.left = '50%'; adBox.style.transform = 'translateX(-50%)'; }

                wrapper.appendChild(adBox);

                // Slideshow Logic
                if (slideshowInterval) clearInterval(slideshowInterval);
                const showCell = (index) => {
                    if (!projectCells[index]) return;
                    const cell = projectCells[index];
                    adBox.innerHTML = '';
                    if (cell.type === 'html') adBox.innerHTML = cell.content;
                    else if (cell.type === 'image') adBox.innerHTML = `<img src="${cell.content}" class="w-full h-full object-cover">`;
                    else if (cell.type === 'video') adBox.innerHTML = `<video src="${cell.content}" autoplay muted loop class="w-full h-full object-cover"></video>`;
                };

                if (projectCells.length > 0) {
                    currentSlideIndex = 0;
                    showCell(0);
                    if (projectCells.length > 1) {
                        const dur = document.getElementById('ad_duration').value * 1000;
                        slideshowInterval = setInterval(() => {
                            currentSlideIndex = (currentSlideIndex + 1) % projectCells.length;
                            showCell(currentSlideIndex);
                        }, dur);
                    }
                }

                if (isLiveViewDraggable) enableInteract(adBox);
            };

            // --- 6. Interact.js Integration ---
            const enableInteract = (el) => {
                interact(el).draggable({
                    listeners: { move(event) {
                        const { target } = event;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }}
                }).resizable({
                    edges: { left: true, right: true, bottom: true, top: true },
                    listeners: { move(event) {
                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`
                        });
                    }}
                });
            };

            // --- 7. Event Listeners ---
            document.getElementById('add-html-btn').addEventListener('click', () => addCell('html', '<div style="color:yellow; text-align:center; padding:20px;">NEW AD HERE</div>'));
            
            document.getElementById('image-upload-input').addEventListener('change', (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (ev) => addCell('image', ev.target.result, file, file.name);
                reader.readAsDataURL(file);
            });

            document.getElementById('liveview-toggle').addEventListener('click', () => {
                isLiveViewDraggable = true;
                document.getElementById('workspace-pane').classList.add('hidden');
                document.getElementById('main-content').classList.replace('grid-cols-2', 'grid-cols-1');
                document.getElementById('liveview-controls').classList.remove('hidden');
                document.getElementById('liveview-save-btn').classList.remove('hidden');
                updatePreview();
            });

            document.getElementById('workplace-toggle').addEventListener('click', () => {
                isLiveViewDraggable = false;
                document.getElementById('workspace-pane').classList.remove('hidden');
                document.getElementById('main-content').classList.replace('grid-cols-1', 'grid-cols-2');
                document.getElementById('liveview-controls').classList.add('hidden');
                updatePreview();
            });

            cellsWrapper.addEventListener('input', (e) => {
                if (e.target.classList.contains('cell-content-input')) {
                    const id = e.target.dataset.id;
                    const cell = projectCells.find(c => c.id === id);
                    if (cell) cell.content = e.target.value;
                    updatePreview();
                }
            });

            cellsWrapper.addEventListener('click', (e) => {
                const btn = e.target.closest('.remove-cell-btn');
                if (btn) {
                    projectCells = projectCells.filter(c => c.id !== btn.dataset.id);
                    renderWorkspaceCells();
                }
            });

            // --- 8. Save Logic ---
            saveBtn.addEventListener('click', async () => {
                saveBtn.disabled = true;
                saveBtn.innerHTML = "Processing...";
                
                try {
                    // Media Upload to Supabase Storage
                    for (let cell of projectCells) {
                        if (cell.file) {
                            const fileName = `${Date.now()}_${cell.name}`;
                            const { data, error } = await supabaseClient.storage
                                .from('ad-media')
                                .upload(fileName, cell.file);
                            if (error) throw error;
                            const { data: urlData } = supabaseClient.storage.from('ad-media').getPublicUrl(fileName);
                            cell.content = urlData.publicUrl;
                            delete cell.file;
                        }
                    }

                    const payload = {
                        ad_name: document.getElementById('ad_name').value,
                        ad_content_html: JSON.stringify(projectCells),
                        pincodes: document.getElementById('pincodes').value.split(',').map(p => p.trim()),
                        ad_size: `${document.getElementById('ad_width').value} ${document.getElementById('ad_height').value}`,
                        ad_position: document.getElementById('ad_position').value,
                        ad_duration: parseInt(document.getElementById('ad_duration').value)
                    };

                    const { error } = await supabaseClient.from('ads').insert([payload]);
                    if (error) throw error;
                    alert("Project Saved Successfully!");
                    window.location.reload();
                } catch (err) {
                    alert("Error: " + err.message);
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = "SAVE PROJECT";
                }
            });

            // Initial Render
            renderWorkspaceCells();
        });
    </script>
</body>
</html>
