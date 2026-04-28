
document.addEventListener('DOMContentLoaded', () => {
            // --- LIVE VIEW DRAG/SAVE ---
            const liveviewSaveBtn = document.getElementById('liveview-save-btn');
            let isLiveViewDraggable = false;
            let lastLiveViewRect = null;
            const liveviewAddFrameBtn = document.getElementById('liveview-add-frame-btn');
            let liveViewFrame = null;
            let frameImage = null;
    // Add frame overlay in Live View
    function addFrameToLiveView() {
        if (liveViewFrame) return; // Only one frame at a time
        const adContainer = document.querySelector('.ad-preview-container');
        if (!adContainer) return;
        // Create frame overlay
        liveViewFrame = document.createElement('div');
        liveViewFrame.className = 'absolute border-4 border-yellow-400 rounded-lg bg-transparent z-30 flex items-center justify-center';
        liveViewFrame.style.top = '40px';
        liveViewFrame.style.left = '40px';
        liveViewFrame.style.width = '300px';
        liveViewFrame.style.height = '200px';
        liveViewFrame.style.cursor = 'move';
        liveViewFrame.style.resize = 'both';
        liveViewFrame.style.overflow = 'hidden';
        // Add image placeholder inside frame
        frameImage = document.createElement('img');
        frameImage.src = '';
        frameImage.alt = 'Frame Image';
        frameImage.style.width = '100%';
        frameImage.style.height = '100%';
        frameImage.style.objectFit = 'cover';
        frameImage.style.cursor = 'pointer';
        frameImage.addEventListener('click', () => {
            // Open file picker to select image
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    frameImage.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });
        liveViewFrame.appendChild(frameImage);
        adContainer.appendChild(liveViewFrame);
        // Make frame draggable/resizable
        interact(liveViewFrame).draggable({
            listeners: {
                move (event) {
                    const target = event.target;
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
                move (event) {
                    let { x, y } = event.target.dataset;
                    x = parseFloat(x) || 0;
                    y = parseFloat(y) || 0;
                    let width = event.rect.width;
                    let height = event.rect.height;
                    event.target.style.width = width + 'px';
                    event.target.style.height = height + 'px';
                    event.target.style.transform = `translate(${x + event.deltaRect.left}px, ${y + event.deltaRect.top}px)`;
                    event.target.setAttribute('data-x', x + event.deltaRect.left);
                    event.target.setAttribute('data-y', y + event.deltaRect.top);
                }
            },
            modifiers: [
                interact.modifiers.restrictEdges({ outer: 'parent' }),
                interact.modifiers.restrictSize({ min: { width: 100, height: 100 } })
            ],
            inertia: true
        });
    }
    // Add Frame button in Live View
    if (liveviewAddFrameBtn) {
        liveviewAddFrameBtn.addEventListener('click', addFrameToLiveView);
    }

            // Enable drag/resize for ad-preview-container in Live View
            function enableLiveViewDragResize() {
                setTimeout(() => {
                    const adPreview = document.querySelector('.ad-preview-container');
                    if (!adPreview) return;
                    isLiveViewDraggable = true;
                    liveviewSaveBtn.classList.remove('hidden');
                    interact(adPreview).draggable({
                        listeners: {
                            move (event) {
                                const target = event.target;
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
                            move (event) {
                                let { x, y } = event.target.dataset;
                                x = parseFloat(x) || 0;
                                y = parseFloat(y) || 0;
                                let width = event.rect.width;
                                let height = event.rect.height;
                                event.target.style.width = width + 'px';
                                event.target.style.height = height + 'px';
                                event.target.style.transform = `translate(${x + event.deltaRect.left}px, ${y + event.deltaRect.top}px)`;
                                event.target.setAttribute('data-x', x + event.deltaRect.left);
                                event.target.setAttribute('data-y', y + event.deltaRect.top);
                            }
                        },
                        modifiers: [
                            interact.modifiers.restrictEdges({ outer: 'parent' }),
                            interact.modifiers.restrictSize({ min: { width: 100, height: 100 } })
                        ],
                        inertia: true
                    });
                }, 300);
            }

            // Save position/size and disable drag/resize
            liveviewSaveBtn && liveviewSaveBtn.addEventListener('click', () => {
                const adPreview = document.querySelector('.ad-preview-container');
                if (!adPreview) return;
                isLiveViewDraggable = false;
                liveviewSaveBtn.classList.add('hidden');
                // Get position and size
                const rect = adPreview.getBoundingClientRect();
                lastLiveViewRect = {
                    width: rect.width,
                    height: rect.height,
                    x: adPreview.getAttribute('data-x') || 0,
                    y: adPreview.getAttribute('data-y') || 0
                };
                // Optionally: Save to DB or update UI
                alert('Position and size saved!');
                interact(adPreview).unset();
            });
        // --- VIEW TOGGLE LOGIC ---
        const workplaceToggle = document.getElementById('workplace-toggle');
        const liveviewToggle = document.getElementById('liveview-toggle');
        const workspacePane = document.getElementById('workspace-pane');
        const previewOuterContainer = document.getElementById('preview-outer-container');
        const mainContent = document.getElementById('main-content');

        function setActiveView(view) {
            if (view === 'workplace') {
                workspacePane.style.display = '';
                previewOuterContainer.style.display = '';
                mainContent.classList.remove('grid-cols-1');
                mainContent.classList.add('grid-cols-2');
                workplaceToggle.classList.add('border-indigo-600', 'text-indigo-600');
                workplaceToggle.classList.remove('border-slate-400', 'text-slate-600');
                liveviewToggle.classList.remove('border-indigo-600', 'text-indigo-600');
                liveviewToggle.classList.add('border-slate-400', 'text-slate-600');
            } else if (view === 'liveview') {
                workspacePane.style.display = 'none';
                previewOuterContainer.style.display = '';
                mainContent.classList.remove('grid-cols-2');
                mainContent.classList.add('grid-cols-1');
                workplaceToggle.classList.remove('border-indigo-600', 'text-indigo-600');
                workplaceToggle.classList.add('border-slate-400', 'text-slate-600');
                liveviewToggle.classList.add('border-indigo-600', 'text-indigo-600');
                liveviewToggle.classList.remove('border-slate-400', 'text-slate-600');
            }
        }

        workplaceToggle.addEventListener('click', () => setActiveView('workplace'));
        liveviewToggle.addEventListener('click', () => setActiveView('liveview'));
        // Default to workplace view
        setActiveView('workplace');
    // Supabase Client
    const _supabaseUrl = "https://vkwxheddyagpjbsrovgh.supabase.co";
    const _supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrd3hoZWRkeWFncGpic3JvdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDM2NjEsImV4cCI6MjA5MDcxOTY2MX0.KN_JLY2owScvkGVy2inJIkEzW82_Qb2a1cavcRJFzlA";
    const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

    // --- DOM ELEMENTS ---
    const adForm = document.getElementById('ad-form');
    const saveBtn = document.getElementById('save-btn');
    const cellsWrapper = document.getElementById('cells-wrapper');
    const workspacePlaceholder = document.getElementById('workspace-placeholder');
    const addHtmlBtn = document.getElementById('add-html-btn');
    const imageUploadInput = document.getElementById('image-upload-input');
    const videoUploadInput = document.getElementById('video-upload-input');
    const addFrameBtn = document.getElementById('add-frame-btn');
    const adPresetSelect = document.getElementById('ad_preset');
    const adPositionSelect = document.getElementById('ad_position');
    const adWidthInput = document.getElementById('ad_width');
    const adHeightInput = document.getElementById('ad_height');
    
    // Preview Elements
    const previewDeviceSelect = document.getElementById('preview-device-select');
    const previewContainer = document.getElementById('preview-container');
    const adContainerWrapper = document.getElementById('ad-container-wrapper');

    // --- STATE ---
    let projectCells = [];
    let cellCounters = { html: 0, image: 0, video: 0, frame: 0 };
    let slideshowInterval = null;
    let currentSlideIndex = 0;


    // --- FUNCTIONS ---

    const getAdData = () => {
        return {
            cells: projectCells.map(cell => ({
                id: cell.id,
                type: cell.type,
                name: cell.name,
                content: cell.content
            })),
            preset: adPresetSelect.value,
            width: adWidthInput.value,
            height: adHeightInput.value,
            position: adPositionSelect.value,
            duration: document.getElementById('ad_duration').value
        };
    };

    const renderWorkspaceCells = () => {
        if (workspacePlaceholder) {
            workspacePlaceholder.style.display = projectCells.length > 0 ? 'none' : 'block';
        }
        cellsWrapper.innerHTML = ''; 

        projectCells.forEach(cell => {
            const cellEl = document.createElement('div');
            cellEl.id = cell.id;
            
            if (cell.type === 'frame') {
                cellEl.className = 'resizable-draggable frame-cell';
                cellEl.style.width = cell.width + 'px';
                cellEl.style.height = cell.height + 'px';
                cellEl.style.transform = `translate(${cell.x}px, ${cell.y}px)`;
                cellEl.dataset.x = cell.x;
                cellEl.dataset.y = cell.y;
            } else {
                cellEl.className = 'cell-card w-80 h-64 bg-white rounded-xl p-3 flex flex-col shrink-0 border';
            }
            
            let contentHtml = '';
            if (cell.type === 'html') {
                contentHtml = `<textarea class="w-full h-full p-2 bg-slate-900 text-green-400 font-mono text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 resize-none cell-content-input" data-cell-id="${cell.id}">${cell.content}</textarea>`;
            } else if (cell.type === 'image') {
                contentHtml = `<img src="${cell.content}" class="w-full h-full object-contain rounded-lg bg-slate-100">`;
            } else if (cell.type === 'video') {
                contentHtml = `<video src="${cell.content}" class="w-full h-full object-contain rounded-lg bg-black" controls muted loop></video>`;
            } else if (cell.type === 'frame') {
                 contentHtml = `<div class="inner-frame w-full h-full border-2 border-dashed border-gray-400 rounded-lg bg-white bg-opacity-20"></div>`;
            }

            const nameHtml = `<p class="font-bold text-sm text-slate-700">${cell.name}</p>`;
            const removeBtnHtml = `<button type="button" class="text-red-400 hover:text-red-600 p-1 rounded-full leading-none text-xl remove-cell-btn" data-cell-id="${cell.id}">&times;</button>`;

            if(cell.type !== 'frame') {
                 cellEl.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                       ${nameHtml}
                       ${removeBtnHtml}
                    </div>
                    <div class="flex-1 min-h-0">${contentHtml}</div>
                `;
            } else {
                cellEl.innerHTML = contentHtml;
                 cellEl.querySelector('.inner-frame').innerHTML = `
                    <div class="frame-header p-1 bg-gray-800 bg-opacity-50 flex justify-between items-center cursor-move">
                         ${nameHtml}
                         ${removeBtnHtml}
                    </div>
                `;
            }

            cellsWrapper.appendChild(cellEl);
        });
        updatePreview(); 
    };

    const addCell = (type, content, file = null, name = '') => {
        cellCounters[type]++;
        const cellId = `cell_${type}_${Date.now()}`;
        const newCell = {
            id: cellId,
            type,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${cellCounters[type]}`,
            content, 
            file,    
        };

        if (type === 'frame') {
            newCell.x = 50;
            newCell.y = 50;
            newCell.width = 200;
            newCell.height = 150;
        }

        projectCells.push(newCell);
        renderWorkspaceCells();
    };

    const processAndAddFileCell = (file, type) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            addCell(type, e.target.result, file, file.name);
        };
        reader.readAsDataURL(file);
    };

    const saveProject = async (e) => {
        e.preventDefault();
        saveBtn.disabled = true; saveBtn.innerText = "Saving...";
        try {
            const adId = document.getElementById('ad-id').value;
            
            const uploadPromises = projectCells.map(async (cell) => {
                if (cell.file && !cell.content.startsWith('https://')) {
                    const fileName = `public/${Date.now()}_${cell.file.name.replace(/ /g, '_')}`;
                    const { error: uploadError } = await supabaseClient.storage.from('ad-media').upload(fileName, cell.file);
                    if (uploadError) throw uploadError;
                    const { data: urlData } = supabaseClient.storage.from('ad-media').getPublicUrl(fileName);
                    cell.content = urlData.publicUrl;
                }
                const {file, ...cellToSave} = cell; 
                return cellToSave;
            });
            const finalCells = await Promise.all(uploadPromises);
            
            const adPayload = {
                ad_name: document.getElementById('ad_name').value,
                pincodes: document.getElementById('pincodes').value.split(',').map(p => p.trim()).filter(p => p),
                serial_number: document.getElementById('serial_number').value ? parseInt(document.getElementById('serial_number').value, 10) : null,
                ad_content_html: finalCells.length > 0 ? JSON.stringify(finalCells) : null,
                ad_type: finalCells.length > 1 ? 'slideshow' : (finalCells[0] ? finalCells[0].type : 'project'),
                ad_duration: document.getElementById('ad_duration').value ? parseInt(document.getElementById('ad_duration').value, 10) : null,
                ad_size: `${adWidthInput.value || ''} ${adHeightInput.value || ''}`.trim(),
                ad_position: adPositionSelect.value || 'center',
            };
            
            const { data, error } = adId 
                ? await supabaseClient.from('ads').update(adPayload).eq('id', adId).select() 
                : await supabaseClient.from('ads').insert([adPayload]).select();

            if (error) throw error;

            alert(adId ? "Project Updated!" : "Project Saved!");
            window.location.href = 'ad_manager.html';

        } catch (error) {
            console.error("Save Error:", error);
            alert("Save Error: " + error.message);
        } finally {
            saveBtn.disabled = false; 
            saveBtn.innerText = document.getElementById('ad-id').value ? 'Update' : 'Save';
        }
    };
    
    const loadAdForEditing = async (adId) => {
        const { data: ad, error } = await supabaseClient.from('ads').select('*').eq('id', adId).single();
        if (error) {
            alert('Failed to load ad data.'); 
            window.location.href = 'ad_manager.html'; 
            return;
        }

        document.getElementById('ad-id').value = ad.id;
        document.getElementById('ad_name').value = ad.ad_name;
        document.getElementById('pincodes').value = (ad.pincodes || []).join(', ');
        document.getElementById('serial_number').value = ad.serial_number || '';
        document.getElementById('ad_duration').value = ad.ad_duration || '';
        adPositionSelect.value = ad.ad_position || 'center';

        if (ad.ad_position === 'bottom_center' && ad.ad_size === '90% 15%') {
             adPresetSelect.value = 'bottom_banner';
        } else {
             adPresetSelect.value = 'custom';
        }

        if (ad.ad_size) {
            const sizeParts = ad.ad_size.split(' ');
            adWidthInput.value = sizeParts[0] || '';
            adHeightInput.value = sizeParts.length > 1 ? sizeParts[1] : '';
        }

        if (ad.ad_content_html && ad.ad_content_html.trim().startsWith('[')) {
            try {
                projectCells = JSON.parse(ad.ad_content_html);
                if (!Array.isArray(projectCells)) projectCells = [];
            } catch(e) { 
                projectCells = []; 
            }
        }
        renderWorkspaceCells();
        saveBtn.innerText = 'Update';
        document.querySelector('h1').innerText = 'Edit Ad';
    };

    const handlePresetChange = () => {
        const presets = {
            'center_window': { position: 'center', width: '70%', height: '60%' },
            'fullscreen': { position: 'fullscreen', width: '100%', height: '100%' },
            'bottom_banner': { position: 'bottom_center', width: '90%', height: '15%' },
            'top_banner': { position: 'top_center', width: '90%', height: '15%' },
            'bottom_right_popup': { position: 'bottom_right', width: '300px', height: '250px' }
        };
        const preset = presets[adPresetSelect.value];
        if (preset) {
            adPositionSelect.value = preset.position;
            adWidthInput.value = preset.width;
            adHeightInput.value = preset.height;
        }
        updatePreview();
    };

    // --- PREVIEW LOGIC ---
    const renderPreviewCell = (adContainer, cell) => {
        adContainer.innerHTML = '';
        if (!cell) {
             adContainer.innerHTML = '<p style="color: white; text-align: center; padding-top: 20px;">No content to display.</p>';
            return;
        }

        if (cell.type === 'html') {
            const htmlContainer = document.createElement('div');
            htmlContainer.className = 'ad-preview-container-html';
            htmlContainer.innerHTML = cell.content;
            adContainer.appendChild(htmlContainer);
        } else if (cell.type === 'image') {
            const img = document.createElement('img');
            img.src = cell.content;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            adContainer.appendChild(img);
        } else if (cell.type === 'video') {
            const video = document.createElement('video');
            video.src = cell.content;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'contain';
            adContainer.appendChild(video);
        }
    };
    
    const updatePreview = () => {
        const adData = getAdData();
        const device = previewDeviceSelect.value;

        // Reset and apply device styles
        previewContainer.style.cssText = '';
        if (device === 'mobile') {
            previewContainer.style.width = '375px';
            previewContainer.style.height = '667px';
        } else if (device === 'desktop') {
            previewContainer.style.width = '1024px';
            previewContainer.style.height = '768px';
        } else { // Responsive
            previewContainer.style.width = '100%';
            previewContainer.style.height = '100%';
        }

        adContainerWrapper.innerHTML = '';
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-preview-container';
        adContainer.style.width = adData.width || '100%';
        adContainer.style.height = adData.height || '100%';

        // This is a simplified positioning logic.
        // For a full implementation, you'd mirror the live display logic more closely.
        adContainerWrapper.style.display = 'flex';
        if (adData.position.includes('top')) adContainerWrapper.style.alignItems = 'flex-start';
        else if (adData.position.includes('bottom')) adContainerWrapper.style.alignItems = 'flex-end';
        else adContainerWrapper.style.alignItems = 'center';

        if (adData.position.includes('left')) adContainerWrapper.style.justifyContent = 'flex-start';
        else if (adData.position.includes('right')) adContainerWrapper.style.justifyContent = 'flex-end';
        else adContainerWrapper.style.justifyContent = 'center';

        adContainerWrapper.appendChild(adContainer);
        // Show drag/resize only in Live View mode
        if (typeof setActiveView === 'function' && isLiveViewDraggable) {
            enableLiveViewDragResize();
        }
        // Reset frame overlay if switching content
        liveViewFrame = null;

        // Slideshow logic
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }

        const showNextCell = () => {
            if (adData.cells && adData.cells.length > 0) {
                renderPreviewCell(adContainer, adData.cells[currentSlideIndex]);
                currentSlideIndex = (currentSlideIndex + 1) % adData.cells.length;
            } else {
                renderPreviewCell(adContainer, null);
            }
        };

        showNextCell(); // Initial cell render

        if (adData.cells && adData.cells.length > 1 && adData.duration) {
            slideshowInterval = setInterval(showNextCell, adData.duration * 1000);
        }
    };

    // --- EVENT LISTENERS ---
    // Enable drag/resize when switching to Live View
    if (liveviewToggle && workplaceToggle) {
        liveviewToggle.addEventListener('click', () => {
            enableLiveViewDragResize();
            // Show Add Frame button in Live View
            if (liveviewAddFrameBtn) liveviewAddFrameBtn.classList.remove('hidden');
        });
        workplaceToggle.addEventListener('click', () => {
            if (liveviewAddFrameBtn) liveviewAddFrameBtn.classList.add('hidden');
        });
    }
    addHtmlBtn.addEventListener('click', () => addCell('html', '<div>\n  \n</div>'));
    addFrameBtn.addEventListener('click', () => addCell('frame', ''));
    imageUploadInput.addEventListener('change', (e) => processAndAddFileCell(e.target.files[0], 'image'));
    videoUploadInput.addEventListener('change', (e) => processAndAddFileCell(e.target.files[0], 'video'));
    adForm.addEventListener('submit', saveProject);
    adPresetSelect.addEventListener('change', handlePresetChange);
    previewDeviceSelect.addEventListener('change', updatePreview);
    
    // Add event listeners for input changes that should trigger preview refresh
    ['ad_name', 'pincodes', 'serial_number', 'ad_duration', 'ad_width', 'ad_height'].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
    adPositionSelect.addEventListener('change', updatePreview);

    cellsWrapper.addEventListener('click', (e) => {
        if (e.target.matches('.remove-cell-btn')) {
            const cellId = e.target.closest('.resizable-draggable, .cell-card').id;
            projectCells = projectCells.filter(c => c.id !== cellId);
            renderWorkspaceCells();
        }
    });

    cellsWrapper.addEventListener('input', (e) => {
        if (e.target.matches('.cell-content-input')) {
            const cellId = e.target.dataset.cellId;
            const cell = projectCells.find(c => c.id === cellId);
            if (cell) {
                cell.content = e.target.value;
                updatePreview();
            }
        }
    });


    // --- INITIALIZATION ---
    (async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const adIdToEdit = urlParams.get('edit');
        if (adIdToEdit) {
            await loadAdForEditing(adIdToEdit);
        } else {
            renderWorkspaceCells();
        }
        updatePreview();
    })();
});
