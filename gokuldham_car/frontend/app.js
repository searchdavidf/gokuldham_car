const numCarsEl = document.getElementById('num_cars');
const carFields = document.getElementById('carFields');
const formMsg = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');

function renderCarFields(){
  carFields.innerHTML = '';
  const n = parseInt(numCarsEl.value || 0, 10);
  for(let i = 0; i < n; i++){
    const wrap = document.createElement('div');
    wrap.className = 'plate-field';

    const plate = document.createElement('div');
    plate.className = 'plate';

    const flag = document.createElement('span');
    flag.className = 'plate-flag';
    flag.textContent = 'IND';

    const inp = document.createElement('input');
    inp.name = `car_${i + 1}`;
    inp.required = true;
    inp.placeholder = 'KA01AB1234';
    inp.setAttribute('aria-label', `Car number ${i + 1}`);

    plate.appendChild(flag);
    plate.appendChild(inp);
    wrap.appendChild(plate);
    carFields.appendChild(wrap);
  }
}
numCarsEl.addEventListener('change', renderCarFields);
renderCarFields();

document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const payload = {
    full_name: data.get('full_name'),
    email: data.get('email'),
    phone: data.get('phone'),
    address: data.get('address'),
    dob: data.get('dob'),
    num_members: parseInt(data.get('num_members') || 1, 10),
    num_cars: parseInt(data.get('num_cars') || 0, 10),
    car_numbers: []
  };
  for(let i = 1; i <= payload.num_cars; i++){
    payload.car_numbers.push(data.get(`car_${i}`));
  }

  formMsg.textContent = '';
  formMsg.classList.remove('msg-success', 'msg-error');
  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Submitting…';

  try{
    const resp = await fetch('/api/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    const j = await resp.json();
    if(resp.ok){
      formMsg.classList.add('msg-success');
      formMsg.textContent = 'Signup submitted — pending admin approval. You will be notified when approved.';
      form.reset();
      renderCarFields();
    } else {
      formMsg.classList.add('msg-error');
      formMsg.textContent = j.error || 'Server validation failed. Please check your entries.';
    }
  }catch(err){
    formMsg.classList.add('msg-error');
    formMsg.textContent = 'Network error — please try again later.';
  }finally{
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

// Tabs for hero
const tabResident = document.getElementById('tab-resident');
const tabAdmin = document.getElementById('tab-admin');
const residentPanel = document.getElementById('tab-resident-panel');
const adminPanel = document.getElementById('tab-admin-panel');

function activateTab(tab){
  if(tab === 'resident'){
    tabResident.setAttribute('aria-selected', 'true');
    tabAdmin.setAttribute('aria-selected', 'false');
    residentPanel.hidden = false;
    adminPanel.hidden = true;
  } else {
    tabResident.setAttribute('aria-selected', 'false');
    tabAdmin.setAttribute('aria-selected', 'true');
    residentPanel.hidden = true;
    adminPanel.hidden = false;
  }
}
tabResident.addEventListener('click', () => activateTab('resident'));
tabAdmin.addEventListener('click', () => activateTab('admin'));

const signupSection = document.getElementById('signup-section');
const gateSection = document.querySelector('.gate');

document.getElementById('register-new').addEventListener('click', () => {
  gateSection.hidden = true;
  signupSection.hidden = false;
  signupSection.scrollIntoView({behavior: 'smooth'});
});

document.getElementById('close-signup').addEventListener('click', () => {
  document.getElementById('signup').reset();
  renderCarFields();
  formMsg.textContent = '';
  formMsg.classList.remove('msg-success', 'msg-error');
  signupSection.hidden = true;
  gateSection.hidden = false;
  gateSection.scrollIntoView({behavior: 'smooth'});
});

document.getElementById('admin-signin').addEventListener('click', async () => {
  const p = document.querySelector('#signin-admin input[name="admin_pass"]').value;
  const r = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({password: p})
  });
  const j = await r.json();
  if(r.ok){
    localStorage.setItem('admin_token', j.token);
    alert('Admin logged in');
    location.href = '/admin/dashboard.html';
  } else {
    alert(j.error || 'Failed');
  }
});
