document.addEventListener('DOMContentLoaded', () => {
    // --- ১. ইনিশিয়ালাইজেশন এবং ভেরিয়েবলস ---
    const _supabaseUrl = "https://vkwxheddyagpjbsrovgh.supabase.co";
    const _supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrd3hoZWRkeWFncGpic3JvdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDM2NjEsImV4cCI6MjA5MDcxOTY2MX0.KN_JLY2owScvkGVy2inJIkEzW82_Qb2a1cavcRJFzlA";
    const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

    let projectCells = [];
    let isLiveViewDraggable = false;
    let slideshowInterval = null;
    let currentSlideIndex = 0;

    // DOM Elements
    const cellsWrapper = document.getElementById('cells-wrapper');
    const adForm = document.getElementById('ad-form');
    const saveBtn = document.getElementById('save-btn');
    const adPreviewWrapper = document.getElementById('ad-container-wrapper');

    // --- ২. ওয়ার্কস্পেস রেন্ডারিং (Editor) ---
    const renderWorkspaceCells = () => {
        const placeholder = document.getElementById('workspace-placeholder');
        if (placeholder) placeholder.style.display = projectCells.length > 0 ? 'none' : 'block';
        
        cellsWrapper.innerHTML = '';
        projectCells.forEach(cell => {
            const card = document.createElement('div');
            card.className = "bg-slate-900 border border-slate-800 p-3 rounded-xl cell-card flex flex-col gap-2 mb-3";
            card.id = cell.id;

            let contentArea = '';
            if (cell.type === 'html') {
                contentArea = `<textarea class="w-full h-24 bg-black text-green-500 p-2 text-xs font-mono rounded border border-slate-700 outline-none cell-content-input" data-id="${cell.id}">${cell.content}</textarea>`;
            } else {
                contentArea = `<div class="flex items-center gap-2 p-2 bg-slate-800 rounded text-xs text-slate-300">
                                 <i data-lucide="${cell.type === 'image' ? 'image' : 'video'}" class="w-4 h-4"></i>
                                 ${cell.name}
                               </div>`;
            }

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold uppercase text-indigo-400">${cell.type} Layer</span>
                    <button class="text-slate-500 hover:text-red-500 remove-cell-btn" data-id="${cell.id}">&times;</button>
                </div>
                ${contentArea}
            `;
            cellsWrapper.appendChild(card);
        });
        if (window.lucide) lucide.createIcons();
        updatePreview();
    };

    // --- ৩. অ্যাড এবং ডিলিট লজিক ---
    window.addCell = (type, content, file = null, name = '') => {
        const newCell = {
            id: `cell_${Date.now()}`,
            type,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${projectCells.length + 1}`,
            content,
            file
        };
        projectCells.push(newCell);
        renderWorkspaceCells();
    };

    cellsWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-cell-btn')) {
            const id = e.target.dataset.id;
            projectCells = projectCells.filter(c => c.id !== id);
            renderWorkspaceCells();
        }
    });

    cellsWrapper.addEventListener('input', (e) => {
        if (e.target.classList.contains('cell-content-input')) {
            const cell = projectCells.find(c => c.id === e.target.dataset.id);
            if (cell) {
                cell.content = e.target.value;
                updatePreview();
            }
        }
    });

    // --- ৪. প্রিভিউ এবং স্লাইডশো লজিক ---
    function updatePreview() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        adPreviewWrapper.innerHTML = '';

        if (projectCells.length === 0) {
            adPreviewWrapper.innerHTML = '<div class="text-slate-700 text-xs text-center mt-20">Preview Empty</div>';
            return;
        }

        const adBox = document.createElement('div');
        adBox.className = "ad-preview-container absolute overflow-hidden shadow-2xl";
        
        // CSS সেটিংস থেকে সাইজ ও পজিশন নেওয়া
        const width = document.getElementById('ad_width').value || '70%';
        const height = document.getElementById('ad_height').value || '60%';
        const pos = document.getElementById('ad_position').value;

        adBox.style.width = width;
        adBox.style.height = height;

        // পজিশনিং ক্যালকুলেশন
        applyPosition(adBox, pos);
        adPreviewWrapper.appendChild(adBox);

        // স্লাইড শো ফাংশন
        const showSlide = (index) => {
            const cell = projectCells[index];
            adBox.innerHTML = '';
            if (cell.type === 'html') adBox.innerHTML = cell.content;
            else if (cell.type === 'image') adBox.innerHTML = `<img src="${cell.content}" class="w-full h-full object-cover">`;
            else if (cell.type === 'video') adBox.innerHTML = `<video src="${cell.content}" autoplay muted loop class="w-full h-full object-cover"></video>`;
        };

        currentSlideIndex = 0;
        showSlide(0);

        if (projectCells.length > 1) {
            const duration = (document.getElementById('ad_duration').value || 5) * 1000;
            slideshowInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % projectCells.length;
                showSlide(currentSlideIndex);
            }, duration);
        }

        if (isLiveViewDraggable) enableDragResize(adBox);
    }

    function applyPosition(el, pos) {
        el.style.top = el.style.bottom = el.style.left = el.style.right = el.style.transform = 'unset';
        if (pos === 'center') { el.style.top = '50%'; el.style.left = '50%'; el.style.transform = 'translate(-50%, -50%)'; }
        else if (pos === 'top_center') { el.style.top = '10px'; el.style.left = '50%'; el.style.transform = 'translateX(-50%)'; }
        else if (pos === 'bottom_center') { el.style.bottom = '10px'; el.style.left = '50%'; el.style.transform = 'translateX(-50%)'; }
        else if (pos === 'bottom_right') { el.style.bottom = '10px'; el.style.right = '10px'; }
    }

    // --- ৫. Interact.js (Drag & Resize) ---
    function enableDragResize(el) {
        interact(el).draggable({
            listeners: {
                move(event) {
                    const { target } = event;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        }).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`
                    });
                }
            }
        });
    }

    // --- ৬. সেভ প্রোজেক্ট (Supabase) ---
    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.innerHTML = "Saving...";

        try {
            // ১. মিডিয়া ফাইল থাকলে আপলোড করা
            for (let cell of projectCells) {
                if (cell.file) {
                    const fileName = `studio_${Date.now()}_${cell.name.replace(/\s/g, '_')}`;
                    const { data, error } = await supabaseClient.storage
                        .from('ad-media')
                        .upload(fileName, cell.file);
                    
                    if (error) throw error;
                    const { data: urlData } = supabaseClient.storage.from('ad-media').getPublicUrl(fileName);
                    cell.content = urlData.publicUrl;
                    delete cell.file; // সেভ করার পর ফাইল অবজেক্ট ডিলিট করা
                }
            }

            // ২. ডেটাবেসে তথ্য ইনসার্ট করা
            const payload = {
                ad_name: document.getElementById('ad_name').value || "Untitled Ad",
                ad_content_html: JSON.stringify(projectCells),
                pincodes: document.getElementById('pincodes').value.split(',').map(p => p.trim()),
                ad_size: `${document.getElementById('ad_width').value} ${document.getElementById('ad_height').value}`,
                ad_position: document.getElementById('ad_position').value,
                ad_duration: parseInt(document.getElementById('ad_duration').value) || 5
            };

            const { error: dbError } = await supabaseClient.from('ads').insert([payload]);
            if (dbError) throw dbError;

            alert("Success! Your Ad is live.");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = "SAVE PROJECT";
        }
    });

    // --- ৭. ভিউ টগল এবং সেটিংস লজিক ---
    document.getElementById('liveview-toggle').addEventListener('click', () => {
        isLiveViewDraggable = true;
        updatePreview();
    });

    document.getElementById('ad_preset').addEventListener('change', (e) => {
        const presets = {
            'center_window': { w: '70%', h: '60%', p: 'center' },
            'fullscreen': { w: '100%', h: '100%', p: 'center' },
            'bottom_banner': { w: '90%', h: '15%', p: 'bottom_center' },
            'bottom_right_popup': { w: '300px', h: '250px', p: 'bottom_right' }
        };
        const pre = presets[e.target.value];
        if (pre) {
            document.getElementById('ad_width').value = pre.w;
            document.getElementById('ad_height').value = pre.h;
            document.getElementById('ad_position').value = pre.p;
            updatePreview();
        }
    });

    // ইভেন্ট লিসেনার ফর ইনপুটস
    ['ad_width', 'ad_height', 'ad_position', 'ad_duration'].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });

    renderWorkspaceCells();
});
