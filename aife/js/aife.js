// BridgeWell World · AIFE 2026 page
// 3D display and AR are handled by <model-viewer>; this script adds the facility list and AR availability notes.

const viewer = document.getElementById('town');
const list = document.getElementById('facilityList');
const resetButton = document.getElementById('resetView');
const arNote = document.getElementById('arNote');
const hint = document.getElementById('hint');

const DEFAULT_ORBIT = viewer.getAttribute('camera-orbit');
const DEFAULT_TARGET = 'auto auto auto';
const FOCUS_DISTANCE = '0.28m';

// Loading progress bar
const progressBar = viewer.querySelector('.progress');
const progressFill = viewer.querySelector('.progress-fill');
viewer.addEventListener('progress', (event) => {
  const progress = event.detail.totalProgress;
  progressFill.style.width = `${Math.round(progress * 100)}%`;
  progressBar.classList.toggle('hide', progress >= 1);
});

// AR availability: Android (WebXR / Scene Viewer) and iPhone (Quick Look) are detected by model-viewer.
viewer.addEventListener('load', () => {
  if (!viewer.canActivateAR) {
    arNote.hidden = false;
  }
});
viewer.addEventListener('ar-status', (event) => {
  if (event.detail.status === 'failed') {
    arNote.hidden = false;
    arNote.textContent = 'AR could not start. You can still explore the town in 3D. (AR needs the published HTTPS page.)';
  }
});

// Hide the gesture hint after the first interaction
viewer.addEventListener('camera-change', (event) => {
  if (event.detail.source === 'user-interaction') {
    hint.style.visibility = 'hidden';
  }
});

function focusFacility(facility, button) {
  const [x, y, z] = facility.position;
  // model-viewer orbit: theta 0deg looks from +Z, 90deg from +X
  const theta = Math.atan2(x, z) * 180 / Math.PI;
  viewer.cameraTarget = `${x}m ${y + 0.02}m ${z}m`;
  viewer.cameraOrbit = `${theta}deg 55deg ${FOCUS_DISTANCE}`;
  for (const other of list.querySelectorAll('.facility')) {
    other.setAttribute('aria-pressed', String(other === button));
  }
}

function resetView() {
  viewer.cameraTarget = DEFAULT_TARGET;
  viewer.cameraOrbit = DEFAULT_ORBIT;
  for (const button of list.querySelectorAll('.facility')) {
    button.setAttribute('aria-pressed', 'false');
  }
}

resetButton.addEventListener('click', resetView);

async function loadFacilities() {
  try {
    const response = await fetch('models/facilities.json');
    const data = await response.json();
    for (const facility of data.facilities) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'facility';
      button.style.setProperty('--swatch', facility.color);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = '<i class="swatch"></i><div><strong></strong><span></span></div>';
      button.querySelector('strong').textContent = facility.name;
      button.querySelector('span').textContent = facility.description;
      button.addEventListener('click', () => focusFacility(facility, button));
      item.appendChild(button);
      list.appendChild(item);
    }
  } catch (error) {
    console.warn('Could not load facilities.json', error);
  }
}

loadFacilities();
