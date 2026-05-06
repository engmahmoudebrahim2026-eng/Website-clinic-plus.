    // === js/db.js ===
    /* ====================================================
       CLINIC+ — Database (LocalStorage Backend)
       Simulates a real backend with CRUD operations
    ==================================================== */

    const DB = {

      // ---- INIT ----
      init() {
        if (!localStorage.getItem('cp_users')) {
          localStorage.setItem('cp_users', JSON.stringify([
            {
              id: 1, firstName: 'محمود', lastName: 'إبراهيم',
              email: 'demo@clinicplus.eg', phone: '01098765432',
              password: 'demo123', dob: '2003-05-14',
              bloodType: 'A+', weight: 75, height: 178,
              diseases: ['التهاب حلق متكرر', 'حساسية أنف موسمية'],
              allergies: ['Penicillin', 'غبار الطلع'],
              createdAt: new Date().toISOString()
            }
          ]));
        }
        if (!localStorage.getItem('cp_bookings')) {
          localStorage.setItem('cp_bookings', JSON.stringify([
            {
              id: 1, userId: 1, docId: 1,
              docName: 'د. أحمد إبراهيم', specialty: 'باطنة',
              date: '2025-04-20', time: '10:00 ص',
              reason: 'التهاب حلق', status: 'confirmed',
              createdAt: new Date().toISOString()
            }
          ]));
        }
        if (!localStorage.getItem('cp_prescriptions')) {
          localStorage.setItem('cp_prescriptions', JSON.stringify([
            {
              id: 1, userId: 1, docId: 1,
              docName: 'د. أحمد إبراهيم', docTitle: 'باطنة — ليسانس طب القاهرة',
              date: '2025-04-10', diagnosis: 'التهاب الحلق الحاد',
              status: 'active',
              meds: [
                { name: 'Panadol Cold & Flu 500mg', dose: 'حبة كل 8 ساعات — بعد الأكل', duration: '5 أيام' },
                { name: 'Amoxicillin 500mg', dose: 'حبة كل 8 ساعات — قبل الأكل', duration: '7 أيام' },
                { name: 'Vitamin C 1000mg', dose: 'حبة يومياً — الصبح بعد الفطار', duration: '30 يوم' },
                { name: 'Betadine Gargle', dose: 'غرغرة 3 مرات يومياً', duration: '5 أيام' }
              ],
              note: 'اشرب ميه كتير وخد قسط من الراحة. لو الأعراض استمرت أكتر من 7 أيام ارجع للدكتور.',
              reminders: [
                { time: '8:00 ص', med: 'Panadol 500mg', freq: 'كل 8 ساعات', on: true, color: 'rgba(5,191,219,0.1)', color2: 'var(--secondary)' },
                { time: '4:00 م', med: 'Amoxicillin 500mg', freq: 'كل 8 ساعات', on: true, color: 'rgba(6,214,160,0.1)', color2: '#06D6A0' },
                { time: '9:00 ص', med: 'Vitamin C 1000mg', freq: 'يومياً', on: false, color: 'rgba(245,158,11,0.1)', color2: '#f59e0b' }
              ]
            },
            {
              id: 2, userId: 1, docId: 1,
              docName: 'د. أحمد إبراهيم', docTitle: 'باطنة',
              date: '2025-03-05', diagnosis: 'صداع ونزلة برد',
              status: 'completed',
              meds: [
                { name: 'Panadol 500mg', dose: 'حبة كل 6 ساعات', duration: '3 أيام' },
                { name: 'Loratadine 10mg', dose: 'حبة يومياً', duration: '5 أيام' },
                { name: 'NuSalus Nasal Spray', dose: 'بخة في كل منخر 3 مرات يومياً', duration: '7 أيام' }
              ],
              note: '',
              reminders: []
            }
          ]));
        }
        if (!localStorage.getItem('cp_ratings')) {
          localStorage.setItem('cp_ratings', JSON.stringify([
            { id: 1, docId: 1, userId: 0, name: 'أحمد محمد', rating: 5, comment: 'دكتور ممتاز ومتعاون جداً، شرح الروشتة كويس', date: '2025-04-12' },
            { id: 2, docId: 1, userId: 0, name: 'سارة علي', rating: 4, comment: 'تجربة حلوة، الانتظار كان شوية بس الدكتور كويس', date: '2025-04-08' },
            { id: 3, docId: 1, userId: 0, name: 'مصطفى خالد', rating: 5, comment: 'أحسن دكتور باطنة اتعاملت معاه. شكراً Clinic+', date: '2025-03-20' },
            { id: 4, docId: 2, userId: 0, name: 'نور الهدى', rating: 5, comment: 'دكتورة رائعة مع الأطفال، ابني اتطمن منها', date: '2025-04-10' },
            { id: 5, docId: 3, userId: 0, name: 'عمرو فاروق', rating: 4, comment: 'كويس بس السعر عالي شوية', date: '2025-04-05' }
          ]));
        }
      },

      // ---- USERS ----
      getUsers: () => JSON.parse(localStorage.getItem('cp_users') || '[]'),
      saveUsers: (u) => localStorage.setItem('cp_users', JSON.stringify(u)),
      getUserById: (id) => DB.getUsers().find(u => u.id === id),
      getUserByEmail: (email) => DB.getUsers().find(u => u.email === email),

      registerUser(data) {
        const users = DB.getUsers();
        if (users.find(u => u.email === data.email)) return { ok: false, msg: 'البريد الإلكتروني مسجل من قبل' };
        const user = { ...data, id: Date.now(), diseases: [], allergies: [], bloodType: 'A+', weight: '', height: '', createdAt: new Date().toISOString() };
        users.push(user);
        DB.saveUsers(users);
        return { ok: true, user };
      },

      loginUser(email, password) {
        const user = DB.getUserByEmail(email);
        if (!user) return { ok: false, msg: 'البريد الإلكتروني غير موجود' };
        if (user.password !== password) return { ok: false, msg: 'كلمة المرور غير صحيحة' };
        return { ok: true, user };
      },

      updateUser(id, data) {
        const users = DB.getUsers();
        const i = users.findIndex(u => u.id === id);
        if (i === -1) return;
        users[i] = { ...users[i], ...data };
        DB.saveUsers(users);
        return users[i];
      },

      // ---- BOOKINGS ----
      getBookings: () => JSON.parse(localStorage.getItem('cp_bookings') || '[]'),
      saveBookings: (b) => localStorage.setItem('cp_bookings', JSON.stringify(b)),
      getBookingsByUser: (uid) => DB.getBookings().filter(b => b.userId === uid),

      addBooking(data) {
        const bookings = DB.getBookings();
        const booking = { ...data, id: Date.now(), status: 'confirmed', createdAt: new Date().toISOString() };
        bookings.push(booking);
        DB.saveBookings(bookings);
        return booking;
      },

      // ---- PRESCRIPTIONS ----
      getPrescriptions: () => JSON.parse(localStorage.getItem('cp_prescriptions') || '[]'),
      savePrescriptions: (p) => localStorage.setItem('cp_prescriptions', JSON.stringify(p)),
      getPrescriptionsByUser: (uid) => DB.getPrescriptions().filter(p => p.userId === uid),
      getActivePrescription: (uid) => DB.getPrescriptions().find(p => p.userId === uid && p.status === 'active'),

      // ---- RATINGS ----
      getRatings: () => JSON.parse(localStorage.getItem('cp_ratings') || '[]'),
      saveRatings: (r) => localStorage.setItem('cp_ratings', JSON.stringify(r)),
      getRatingsByDoc: (docId) => DB.getRatings().filter(r => r.docId === docId),

      addRating(data) {
        const ratings = DB.getRatings();
        const rating = { ...data, id: Date.now(), date: new Date().toLocaleDateString('ar-EG') };
        ratings.unshift(rating);
        DB.saveRatings(ratings);
        return rating;
      },

      getAvgRating(docId) {
        const r = DB.getRatingsByDoc(docId);
        if (!r.length) return 0;
        return (r.reduce((a, b) => a + b.rating, 0) / r.length).toFixed(1);
      }
    };

    // ---- DOCTORS DATA ----
    const DOCTORS = [
      { id: 1, name: 'د. أحمد إبراهيم', spec: 'باطنة', gov: 'القاهرة', area: 'مدينة نصر', phone: '01012345678', price: 250, rating: 4.8, reviews: 124, avail: true, times: ['9:00 ص', '10:00 ص', '11:00 ص', '2:00 م', '3:00 م', '4:00 م'], color: 'linear-gradient(135deg,#0A4D68,#05BFDB)', initial: 'أ' },
      { id: 2, name: 'د. منى سيد فرج', spec: 'أطفال', gov: 'الجيزة', area: 'الدقي', phone: '01098765432', price: 300, rating: 5.0, reviews: 87, avail: true, times: ['10:00 ص', '11:00 ص', '12:00 م', '4:00 م', '5:00 م'], color: 'linear-gradient(135deg,#059669,#06D6A0)', initial: 'م' },
      { id: 3, name: 'د. خالد مصطفى', spec: 'أسنان', gov: 'الإسكندرية', area: 'سموحة', phone: '03012345678', price: 400, rating: 4.3, reviews: 56, avail: false, times: ['11:00 ص', '12:00 م', '5:00 م', '6:00 م'], color: 'linear-gradient(135deg,#f59e0b,#f97316)', initial: 'خ' },
      { id: 4, name: 'د. هاني عبد الله', spec: 'قلب وأوعية دموية', gov: 'القاهرة', area: 'وسط البلد', phone: '01111234567', price: 500, rating: 4.7, reviews: 203, avail: true, times: ['9:00 ص', '10:00 ص', '3:00 م', '4:00 م'], color: 'linear-gradient(135deg,#7c3aed,#a855f7)', initial: 'ه' },
      { id: 5, name: 'د. نادية محمود', spec: 'جلدية', gov: 'القاهرة', area: 'المعادي', phone: '01234567890', price: 350, rating: 4.6, reviews: 98, avail: true, times: ['10:00 ص', '11:00 ص', '4:00 م', '5:00 م'], color: 'linear-gradient(135deg,#dc2626,#f97316)', initial: 'ن' },
      { id: 6, name: 'د. طارق فؤاد', spec: 'عيون', gov: 'الجيزة', area: 'الهرم', phone: '01098712345', price: 280, rating: 4.9, reviews: 145, avail: true, times: ['8:00 ص', '9:00 ص', '10:00 ص', '5:00 م'], color: 'linear-gradient(135deg,#0891b2,#06b6d4)', initial: 'ط' },
      { id: 7, name: 'د. سلوى رجب', spec: 'نساء وتوليد', gov: 'القاهرة', area: 'حلوان', phone: '01056781234', price: 320, rating: 4.5, reviews: 76, avail: true, times: ['11:00 ص', '12:00 م', '1:00 م', '5:00 م', '6:00 م'], color: 'linear-gradient(135deg,#db2777,#ec4899)', initial: 'س' },
      { id: 8, name: 'د. محمد السيد', spec: 'عظام', gov: 'الشرقية', area: 'الزقازيق', phone: '01123456789', price: 220, rating: 4.4, reviews: 63, avail: false, times: ['9:00 ص', '10:00 ص', '11:00 ص', '3:00 م'], color: 'linear-gradient(135deg,#92400e,#b45309)', initial: 'م' },
      { id: 9, name: 'د. إيمان حسن', spec: 'باطنة', gov: 'أسيوط', area: 'وسط المدينة', phone: '01087654321', price: 180, rating: 4.7, reviews: 112, avail: true, times: ['9:00 ص', '10:00 ص', '4:00 م', '5:00 م'], color: 'linear-gradient(135deg,#0A4D68,#05BFDB)', initial: 'إ' },
      { id: 10, name: 'د. عمرو الشافعي', spec: 'أطفال', gov: 'القاهرة', area: 'عين شمس', phone: '01011223344', price: 250, rating: 4.6, reviews: 88, avail: true, times: ['10:00 ص', '11:00 ص', '2:00 م', '3:00 م'], color: 'linear-gradient(135deg,#059669,#06D6A0)', initial: 'ع' },
      { id: 11, name: 'د. هبة الله أمين', spec: 'جلدية', gov: 'الإسكندرية', area: 'المنتزه', phone: '01099887766', price: 300, rating: 4.8, reviews: 134, avail: true, times: ['9:00 ص', '10:00 ص', '3:00 م', '4:00 م'], color: 'linear-gradient(135deg,#dc2626,#f97316)', initial: 'ه' },
      { id: 12, name: 'د. كريم ناصر', spec: 'مسالك بولية', gov: 'الجيزة', area: '6 أكتوبر', phone: '01055667788', price: 400, rating: 4.5, reviews: 67, avail: true, times: ['11:00 ص', '12:00 م', '4:00 م', '5:00 م'], color: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', initial: 'ك' }
    ];

    const PHARMACIES = [
      { id: 1, name: 'صيدلية النور', area: 'مدينة نصر', dist: '0.3 كم', phone: '01098765432', hours: '9ص–12ص', delivery: true, open: true, h24: false },
      { id: 2, name: 'صيدلية الشفاء', area: 'الهرم', dist: '1.2 كم', phone: '01012345678', hours: '24/7', delivery: true, open: true, h24: true },
      { id: 3, name: 'صيدلية د. حسن', area: 'وسط البلد', dist: '2.5 كم', phone: '0225789632', hours: '10ص–10م', delivery: false, open: true, h24: false },
      { id: 4, name: 'صيدلية العزبي', area: 'المهندسين', dist: '3.1 كم', phone: '01155443322', hours: '8ص–11م', delivery: true, open: true, h24: false },
      { id: 5, name: 'صيدلية سيف', area: 'الزمالك', dist: '4.0 كم', phone: '01066778899', hours: '24/7', delivery: true, open: true, h24: true },
      { id: 6, name: 'صيدلية رامي', area: 'مصر الجديدة', dist: '5.2 كم', phone: '01033221144', hours: '9ص–11م', delivery: false, open: false, h24: false }
    ];

    const GOVS = [
      { name: 'القاهرة', icon: 'fa-city' },
      { name: 'الجيزة', icon: 'fa-city' },
      { name: 'الإسكندرية', icon: 'fa-water' },
      { name: 'أسيوط', icon: 'fa-map' },
      { name: 'المنيا', icon: 'fa-map' },
      { name: 'سوهاج', icon: 'fa-map' },
      { name: 'الأقصر', icon: 'fa-monument' },
      { name: 'أسوان', icon: 'fa-monument' },
      { name: 'الشرقية', icon: 'fa-map' },
      { name: 'الدقهلية', icon: 'fa-map' },
      { name: 'الغربية', icon: 'fa-map' },
      { name: 'بني سويف', icon: 'fa-map' }
    ];

    const SPECS = [
      { name: 'باطنة', icon: 'fa-stethoscope' },
      { name: 'أطفال', icon: 'fa-baby' },
      { name: 'أسنان', icon: 'fa-tooth' },
      { name: 'عيون', icon: 'fa-eye' },
      { name: 'جلدية', icon: 'fa-hand-dots' },
      { name: 'قلب وأوعية دموية', icon: 'fa-heart-pulse' },
      { name: 'عظام', icon: 'fa-bone' },
      { name: 'نساء وتوليد', icon: 'fa-venus' },
      { name: 'أنف وأذن وحنجرة', icon: 'fa-head-side-cough' },
      { name: 'مسالك بولية', icon: 'fa-kidneys' },
      { name: 'نفسي وعصبي', icon: 'fa-brain' },
      { name: 'تغذية', icon: 'fa-apple-whole' }
    ];

    const RATING_LABELS = { 1: 'سيئ 😞', 2: 'مقبول 😐', 3: 'كويس 🙂', 4: 'جيد جداً 😊', 5: 'ممتاز 🌟' };

    // === js/auth.js ===
    /* ====================================================
       CLINIC+ — Auth Module
    ==================================================== */

    let currentUser = null;

    function loadSession() {
      const stored = localStorage.getItem('cp_session');
      if (stored) {
        const session = JSON.parse(stored);
        const user = DB.getUserById(session.userId);
        if (user) {
          currentUser = user;
          updateNavAuth();
        }
      }
    }

    function saveSession(user) {
      localStorage.setItem('cp_session', JSON.stringify({ userId: user.id }));
      currentUser = user;
      updateNavAuth();
    }

    function updateNavAuth() {
      const loggedOut = document.getElementById('navLoggedOut');
      const loggedIn = document.getElementById('navLoggedIn');
      const nameEl = document.getElementById('navUserName');
      if (currentUser) {
        loggedOut.style.display = 'none';
        loggedIn.style.display = 'flex';
        loggedIn.style.alignItems = 'center';
        nameEl.textContent = `أهلاً، ${currentUser.firstName}!`;
      } else {
        loggedOut.style.display = 'flex';
        loggedIn.style.display = 'none';
      }
    }

    function doLogin() {
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPass').value;
      const errEl = document.getElementById('loginError');
      errEl.classList.add('d-none');

      if (!email || !pass) {
        errEl.textContent = 'من فضلك ادخل البريد الإلكتروني وكلمة المرور';
        errEl.classList.remove('d-none'); return;
      }

      const res = DB.loginUser(email, pass);
      if (!res.ok) {
        errEl.textContent = res.msg;
        errEl.classList.remove('d-none'); return;
      }

      saveSession(res.user);
      showToast(`أهلاً ${res.user.firstName}! 👋`, 'success');
      navigate('home');
    }

    function demoLogin() {
      document.getElementById('loginEmail').value = 'demo@clinicplus.eg';
      document.getElementById('loginPass').value = 'demo123';
      doLogin();
    }

    function doRegister() {
      const first = document.getElementById('regFirst').value.trim();
      const last = document.getElementById('regLast').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const dob = document.getElementById('regDob').value;
      const pass = document.getElementById('regPass').value;
      const errEl = document.getElementById('regError');
      errEl.classList.add('d-none');

      if (!first || !last || !email || !phone || !pass) {
        errEl.textContent = 'من فضلك املأ جميع الحقول المطلوبة';
        errEl.classList.remove('d-none'); return;
      }
      if (pass.length < 6) {
        errEl.textContent = 'كلمة المرور لازم تكون 6 أحرف على الأقل';
        errEl.classList.remove('d-none'); return;
      }

      const res = DB.registerUser({ firstName: first, lastName: last, email, phone, dob, password: pass });
      if (!res.ok) {
        errEl.textContent = res.msg;
        errEl.classList.remove('d-none'); return;
      }

      saveSession(res.user);
      showToast('تم إنشاء حسابك بنجاح! 🎉', 'success');
      navigate('home');
    }

    function logout() {
      localStorage.removeItem('cp_session');
      currentUser = null;
      updateNavAuth();
      showToast('تم تسجيل الخروج بنجاح', 'info');
      navigate('home');
    }

    function requireAuth(page) {
      if (!currentUser) {
        showToast('لازم تسجل دخولك الأول! 🔐', 'warning');
        navigate('login');
        return false;
      }
      return true;
    }

    // === js/booking.js ===
    /* ====================================================
       CLINIC+ — Booking Module
    ==================================================== */

    let bkSelectedGov = '';
    let bkSelectedSpec = '';
    let bkSelectedDoc = null;
    let bkSelectedTime = '';
    let bkCurrentDocs = [];

    function initBookingPage() {
      renderGovGrid();
      bkGoStep(1);
    }

    function renderGovGrid() {
      const grid = document.getElementById('govGrid');
      grid.innerHTML = GOVS.map(g => `
    <div class="gov-item" onclick="selGov('${g.name}', this)">
      <div class="gov-icon"><i class="fas ${g.icon}"></i></div>
      <span>${g.name}</span>
    </div>`).join('');
    }

    function selGov(name, el) {
      bkSelectedGov = name;
      document.querySelectorAll('.gov-item').forEach(i => i.classList.remove('sel'));
      el.classList.add('sel');
      setTimeout(() => bkGoStep(2), 300);
    }

    function renderSpecGrid() {
      const grid = document.getElementById('specGrid');
      grid.innerHTML = SPECS.map(s => `
    <div class="spec-item-bk" onclick="selSpec('${s.name}', this)">
      <div class="si-icon"><i class="fas ${s.icon}"></i></div>
      <span>${s.name}</span>
    </div>`).join('');
      document.getElementById('bkGovLabel').textContent = bkSelectedGov;
    }

    function selSpec(name, el) {
      bkSelectedSpec = name;
      document.querySelectorAll('.spec-item-bk').forEach(i => i.classList.remove('sel'));
      el.classList.add('sel');
      setTimeout(() => bkGoStep(3), 300);
    }

    function bkGoStep(n) {
      document.getElementById('bkStep1').style.display = n === 1 ? '' : 'none';
      document.getElementById('bkStep2').style.display = n === 2 ? '' : 'none';
      document.getElementById('bkStep3').style.display = n === 3 ? '' : 'none';

      ['bkS1', 'bkS2', 'bkS3'].forEach((id, i) => {
        const el = document.getElementById(id);
        el.classList.remove('active', 'done');
        if (i + 1 === n) el.classList.add('active');
        else if (i + 1 < n) el.classList.add('done');
      });

      if (n === 2) renderSpecGrid();
      if (n === 3) renderDocsList();
    }

    function renderDocsList(docs, sortBy) {
      let list = docs || DOCTORS.filter(d =>
        d.gov === bkSelectedGov && d.spec === bkSelectedSpec
      );
      if (!list.length) {
        list = DOCTORS.filter(d => d.spec === bkSelectedSpec);
      }

      bkCurrentDocs = [...list];
      sortDocs(sortBy || 'rating');

      document.getElementById('bkSpecLabel').textContent = bkSelectedSpec;
      document.getElementById('bkGovLabel2').textContent = bkSelectedGov;
    }

    function sortDocs(by) {
      let sorted = [...bkCurrentDocs];
      if (by === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      else if (by === 'price_asc') sorted.sort((a, b) => a.price - b.price);
      else if (by === 'price_desc') sorted.sort((a, b) => b.price - a.price);

      document.getElementById('docCount').textContent = sorted.length;

      const list = document.getElementById('docsList');
      list.innerHTML = sorted.length ? sorted.map(d => buildDocCard(d)).join('') :
        `<div class="content-card text-center py-5">
      <i class="fas fa-user-doctor fa-3x mb-3" style="color:var(--muted)"></i>
      <p class="text-muted">لا يوجد دكاترة ${bkSelectedSpec} في ${bkSelectedGov} حالياً</p>
      <button class="btn-primary-full" style="width:auto;padding:10px 28px;margin:0 auto" onclick="bkGoStep(2)">اختار تخصص تاني</button>
    </div>` ;
    }

    function buildDocCard(d) {
      const avg = DB.getAvgRating(d.id) || d.rating;
      const stars = buildStars(avg);
      return `
  <div class="doc-list-card">
    <div class="dlc-avatar" style="background:${d.color}">${d.initial}</div>
    <div class="dlc-info">
      <div class="dlc-name">${d.name}</div>
      <div class="dlc-meta"><i class="fas fa-map-marker-alt fa-xs"></i>${d.area}، ${d.gov}</div>
      <div class="dlc-meta"><i class="fas fa-phone fa-xs"></i>${d.phone}</div>
      <div class="d-flex align-items-center gap-2 mt-1">
        <div class="dlc-stars">${stars}</div>
        <small class="text-muted">${avg} (${d.reviews} تقييم)</small>
      </div>
      <div class="dlc-badges mt-1">
        <span class="tag-spec">${d.spec}</span>
        <span class="tag-price">${d.price} جنيه</span>
        <span class="${d.avail ? 'avail-yes' : 'avail-no'}">${d.avail ? 'متاح الآن' : 'مشغول'}</span>
      </div>
    </div>
    <div class="dlc-actions">
      <button class="btn-book-list" onclick="openBookModal(${d.id})"><i class="fas fa-calendar-plus me-1"></i>احجز</button>
      <button class="btn-rate-list" onclick="navigate('rating'); setRatingDoc(${d.id})"><i class="fas fa-star me-1"></i>قيّم</button>
    </div>
  </div>`;
    }

    function openBookModal(docId) {
      if (!requireAuth()) return;
      const doc = DOCTORS.find(d => d.id === docId);
      bkSelectedDoc = doc;

      document.getElementById('bookModalTitle').textContent = `حجز مع ${doc.name}`;
      document.getElementById('bookDocPreview').innerHTML = `
    <div class="dmc-avatar" style="background:${doc.color}">${doc.initial}</div>
    <div>
      <div class="dmc-name">${doc.name}</div>
      <div class="dmc-meta">${doc.spec} — ${doc.area} — ${doc.price} جنيه</div>
    </div>`;

      const today = new Date().toISOString().split('T')[0];
      document.getElementById('bookDate').value = today;
      document.getElementById('bookDate').min = today;

      renderTimeSlots(doc.times);

      const modal = new bootstrap.Modal(document.getElementById('bookModal'));
      modal.show();
    }

    function renderTimeSlots(times) {
      bkSelectedTime = '';
      document.getElementById('timeSlots').innerHTML = times.map(t => `
    <div class="time-slot" onclick="selTime(this, '${t}')">${t}</div>`).join('');
    }

    function selTime(el, time) {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
      el.classList.add('active');
      bkSelectedTime = time;
    }

    function confirmBooking() {
      const date = document.getElementById('bookDate').value;
      const reason = document.getElementById('bookReason').value;

      if (!date) { showToast('اختار تاريخ الحجز', 'warning'); return; }
      if (!bkSelectedTime) { showToast('اختار وقت الحجز', 'warning'); return; }

      DB.addBooking({
        userId: currentUser.id,
        docId: bkSelectedDoc.id,
        docName: bkSelectedDoc.name,
        specialty: bkSelectedDoc.spec,
        date, time: bkSelectedTime, reason
      });

      bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide();
      showToast(`تم تأكيد حجزك مع ${bkSelectedDoc.name} ✅`, 'success');
      navigate('medfile');
    }

    function heroSearch() {
      const gov = document.getElementById('heroGov').value;
      const spec = document.getElementById('heroSpec').value;
      if (!gov || !spec) { showToast('اختار المحافظة والتخصص الأول', 'warning'); return; }
      bkSelectedGov = gov;
      bkSelectedSpec = spec;
      navigate('booking');
      bkGoStep(3);
    }

    function buildStars(rating) {
      let s = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) s += '★';
        else if (i - rating < 1) s += '½';
        else s += '☆';
      }
      return s;
    }

    // === js/prescription.js ===
    /* ====================================================
       CLINIC+ — Prescription Module
    ==================================================== */
    function initPrescriptionPage() {
      const uid = currentUser ? currentUser.id : 1;
      const rxs = DB.getPrescriptionsByUser(uid);
      const list = document.getElementById('rxList');

      list.innerHTML = rxs.map(rx => buildRxCard(rx)).join('');
      renderReminders(rxs.find(r => r.status === 'active'));
    }

    function buildRxCard(rx) {
      const isOld = rx.status === 'completed';
      return `
  <div class="rx-card">
    <div class="rx-card-head ${isOld ? 'old' : ''}">
      <div>
        <div class="rx-meta">${isOld ? 'روشتة سابقة' : 'روشتة نشطة'}</div>
        <div class="rx-num">#RX-${String(rx.id).padStart(4, '0')}</div>
        <div class="rx-date"><i class="fas fa-calendar me-1"></i>${rx.date}</div>
      </div>
      <div style="text-align:left">
        <div class="rx-logo">Clinic<span>+</span></div>
        ${isOld ? '<span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:.76rem;margin-top:6px;display:inline-block">مكتملة ✅</span>' : ''}
      </div>
    </div>
    <div class="rx-body">
      <div class="rx-patient-info">
        <div class="rpi-field"><label>اسم المريض</label><span>${currentUser ? currentUser.firstName + ' ' + currentUser.lastName : "عباس صالح"}</span></div>
        <div class="rpi-field"><label>التشخيص</label><span>${rx.diagnosis}</span></div>
        <div class="rpi-field"><label>التاريخ</label><span>${rx.date}</span></div>
      </div>
      <div class="fw-bold mb-3" style="color:var(--primary);font-size:.88rem"><i class="fas fa-pills me-2"></i>الأدوية الموصوفة:</div>
      ${rx.meds.map((m, i) => `
        <div class="med-row">
          <div class="med-row-num">${i + 1}</div>
          <div class="med-info">
            <div class="med-name-t">${m.name}</div>
            <div class="med-dose-t"><i class="fas fa-clock fa-xs me-1"></i>${m.dose}</div>
          </div>
          <div class="med-dur-tag">${m.duration}</div>
        </div>`).join('')}
      ${rx.note ? `<div class="alert mt-3" style="background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);border-radius:11px;color:#92400e;font-size:.86rem;padding:12px 16px"><i class="fas fa-info-circle me-2"></i><strong>ملاحظة:</strong> ${rx.note}</div>` : ''}
    </div>
    <div class="rx-footer">
      <div>
        <div class="rx-doc-name"><i class="fas fa-user-md me-1"></i>${rx.docName}</div>
        <div class="rx-doc-title">${rx.docTitle}</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        ${!isOld ? `<button class="btn-order-meds" onclick="navigate('pharmacy')"><i class="fas fa-capsules me-1"></i>اطلب الدواء</button>` : ''}
        <button class="btn-order-meds" style="background:var(--light);color:var(--muted);border:1px solid var(--border)" onclick="showToast('جاري تحميل الـ PDF...','info')"><i class="fas fa-download me-1"></i>PDF</button>
      </div>
    </div>
  </div>`;
    }

    function renderReminders(rx) {
      const el = document.getElementById('remindersList');
      if (!rx) { el.innerHTML = '<p class="text-muted small">لا توجد روشتة نشطة</p>'; return; }
      el.innerHTML = rx.reminders.map((r, i) => `
    <div class="reminder-item">
      <div class="rem-time" style="background:${r.color};color:${r.color2}">${r.time}</div>
      <div class="flex-grow-1">
        <div class="fw-bold" style="font-size:.84rem">${r.med}</div>
        <div class="text-muted" style="font-size:.74rem">${r.freq}</div>
      </div>
      <div class="form-check form-switch mb-0">
        <input class="form-check-input" type="checkbox" id="rem${i}" ${r.on ? 'checked' : ''}>
      </div>
    </div>`).join('');
    }

    function saveReminders() { showToast('تم حفظ الإشعارات ✅', 'success'); }

    /* ====================================================
       CLINIC+ — Pharmacy Module
    ==================================================== */
    let pharmFilter = 'all';

    function initPharmacyPage() {
      const uid = currentUser ? currentUser.id : 1;
      const rx = DB.getActivePrescription(uid);
      const banner = document.getElementById('rxBanner');
      if (rx) {
        document.getElementById('rxBannerNum').textContent = `#RX-${String(rx.id).padStart(4, '0')}`;
        document.getElementById('rxBannerDesc').textContent = `${rx.meds.length} أدوية — ${rx.diagnosis}`;
      } else {
        banner.style.display = 'none';
      }
      renderPharmacies();
    }

    function renderPharmacies() {
      let list = PHARMACIES;
      if (pharmFilter === 'delivery') list = list.filter(p => p.delivery);
      else if (pharmFilter === 'open') list = list.filter(p => p.open);
      else if (pharmFilter === 'h24') list = list.filter(p => p.h24);

      document.getElementById('pharmList').innerHTML = list.map(p => `
    <div class="col-md-6 col-lg-4">
      <div class="pharm-card">
        <div class="d-flex gap-3 align-items-start mb-3">
          <div class="pharm-ico"><i class="fas fa-plus-square"></i></div>
          <div>
            <div class="pharm-name">${p.name}</div>
            <div class="pharm-loc"><i class="fas fa-map-marker-alt fa-xs me-1"></i>${p.area} — ${p.dist}</div>
          </div>
        </div>
        <div class="d-flex gap-2 flex-wrap mb-3">
          <span class="${p.delivery ? 'del-yes' : 'del-no'}">${p.delivery ? '<i class="fas fa-truck me-1"></i>توصيل متاح' : '<i class="fas fa-times me-1"></i>بدون توصيل'}</span>
          ${p.h24 ? '<span class="open-24">24 ساعة</span>' : p.open ? '<span class="open-now"><i class="fas fa-circle fa-xs me-1"></i>مفتوح الآن</span>' : '<span class="del-no">مغلق</span>'}
        </div>
        <div class="text-muted small mb-3"><i class="fas fa-phone fa-xs me-1"></i>${p.phone} <span class="mx-2">|</span> <i class="fas fa-clock fa-xs me-1"></i>${p.hours}</div>
        <div class="d-flex gap-2">
          <button class="btn-order-now" onclick="orderFromPharm('${p.name}')"><i class="fas fa-shopping-cart me-1"></i>اطلب الآن</button>
          <a href="tel:${p.phone}" class="btn-call"><i class="fas fa-phone"></i></a>
        </div>
      </div>
    </div>`).join('');
    }

    function filterPharm(f, btn) {
      pharmFilter = f;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPharmacies();
    }

    function orderFromPharm(name) {
      showToast(`تم إرسال طلبك لـ ${name} 🚀`, 'success');
    }

    function sendToPharmacy() {
      showToast('تم إرسال الروشتة للصيدلية المختارة ✅', 'success');
    }

    /* ====================================================
       CLINIC+ — Medical File Module
    ==================================================== */
    function initMedfilePage() {
      const uid = currentUser ? currentUser.id : 1;
      const user = currentUser || DB.getUserById(1);

      document.getElementById('profAvatar').textContent = user.firstName ? user.firstName[0] : 'م';
      document.getElementById('profName').textContent = `${user.firstName} ${user.lastName}`;
      document.getElementById('profId').textContent = `#PAT-${String(user.id).padStart(4, '0')}`;

      // Tags
      const bday = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 22;
      document.getElementById('profTags').innerHTML = `
    <span class="prof-tag"><i class="fas fa-birthday-cake me-1"></i>${bday} سنة</span>
    <span class="prof-tag"><i class="fas fa-tint me-1"></i>${user.bloodType || 'A+'}</span>
    ${user.weight ? `<span class="prof-tag"><i class="fas fa-weight me-1"></i>${user.weight} كجم</span>` : ''}
    ${user.height ? `<span class="prof-tag"><i class="fas fa-ruler-vertical me-1"></i>${user.height} سم</span>` : ''}`;

      document.getElementById('bloodType').value = user.bloodType || 'A+';
      document.getElementById('weight').value = user.weight || '';
      document.getElementById('height').value = user.height || '';

      renderDiseaseTags(user.diseases || []);
      renderAllergyTags(user.allergies || []);

      // Prescriptions timeline
      const rxs = DB.getPrescriptionsByUser(uid);
      document.getElementById('rxTimeline').innerHTML = rxs.length ?
        rxs.map(rx => `
      <div class="timeline-item">
        <div class="tl-dot"><i class="fas fa-file-prescription fa-sm"></i></div>
        <div class="flex-grow-1">
          <div class="tl-title">${rx.diagnosis}</div>
          <div class="tl-sub">${rx.meds.length} أدوية — ${rx.docName}</div>
          <div class="tl-date"><i class="fas fa-calendar fa-xs me-1"></i>${rx.date}</div>
        </div>
        <button class="btn-view-sm" onclick="navigate('prescription')">عرض</button>
      </div>`).join('') :
        '<p class="text-muted small">لا توجد روشتات بعد</p>';

      // Labs timeline
      document.getElementById('labTimeline').innerHTML = `
    <div class="timeline-item">
      <div class="tl-dot" style="background:rgba(245,158,11,0.1);color:#f59e0b"><i class="fas fa-vial fa-sm"></i></div>
      <div class="flex-grow-1"><div class="tl-title">صورة دم كاملة (CBC)</div><div class="tl-sub">النتيجة: طبيعي ✅</div><div class="tl-date">8 أبريل 2025</div></div>
      <button class="btn-view-sm" onclick="showToast('تحميل التحليل','info')">تحميل</button>
    </div>
    <div class="timeline-item">
      <div class="tl-dot" style="background:rgba(168,85,247,0.1);color:#9333ea"><i class="fas fa-x-ray fa-sm"></i></div>
      <div class="flex-grow-1"><div class="tl-title">أشعة صدر</div><div class="tl-sub">النتيجة: طبيعي ✅</div><div class="tl-date">10 أبريل 2025</div></div>
      <button class="btn-view-sm" onclick="showToast('تحميل الأشعة','info')">تحميل</button>
    </div>`;

      // Upcoming appointments
      const bookings = DB.getBookingsByUser(uid);
      const upcoming = bookings.filter(b => b.status === 'confirmed');
      document.getElementById('upcomingAppts').innerHTML = upcoming.length ?
        upcoming.map(b => {
          const d = new Date(b.date);
          const day = d.getDate();
          const month = d.toLocaleString('ar-EG', { month: 'short' });
          return `
        <div class="appt-item">
          <div class="appt-date-box"><div class="appt-day">${day}</div><div class="appt-month">${month}</div></div>
          <div class="flex-grow-1">
            <div class="fw-bold" style="font-size:.86rem">${b.docName}</div>
            <div class="text-muted small">${b.specialty} — ${b.time}</div>
          </div>
        </div>`;
        }).join('') :
        '<p class="text-muted small">لا توجد مواعيد قادمة</p>';
    }

    function renderDiseaseTags(diseases) {
      document.getElementById('diseaseTags').innerHTML = diseases.map(d =>
        `<span class="tag-pill">${d}<span onclick="removeTag('disease','${d}')" style="cursor:pointer;margin-right:5px;opacity:.5">×</span></span>`
      ).join('') || '<span class="text-muted small">لا توجد أمراض مسجلة</span>';
    }

    function renderAllergyTags(allergies) {
      document.getElementById('allergyTags').innerHTML = allergies.map(a =>
        `<span class="tag-pill danger"><i class="fas fa-exclamation-triangle fa-xs me-1"></i>${a}<span onclick="removeTag('allergy','${a}')" style="cursor:pointer;margin-right:5px;opacity:.5">×</span></span>`
      ).join('') || '<span class="text-muted small">لا توجد حساسية مسجلة</span>';
    }

    function addMedInfo(type) {
      const label = type === 'disease' ? 'اكتب اسم المرض' : 'اكتب اسم الحساسية';
      const val = prompt(label);
      if (!val || !val.trim()) return;
      const uid = currentUser ? currentUser.id : 1;
      const user = DB.getUserById(uid);
      if (type === 'disease') {
        user.diseases = [...(user.diseases || []), val.trim()];
        DB.updateUser(uid, { diseases: user.diseases });
        renderDiseaseTags(user.diseases);
      } else {
        user.allergies = [...(user.allergies || []), val.trim()];
        DB.updateUser(uid, { allergies: user.allergies });
        renderAllergyTags(user.allergies);
      }
      if (currentUser) currentUser = DB.getUserById(uid);
      showToast('تم الإضافة ✅', 'success');
    }

    function removeTag(type, val) {
      const uid = currentUser ? currentUser.id : 1;
      const user = DB.getUserById(uid);
      if (type === 'disease') {
        user.diseases = user.diseases.filter(d => d !== val);
        DB.updateUser(uid, { diseases: user.diseases });
        renderDiseaseTags(user.diseases);
      } else {
        user.allergies = user.allergies.filter(a => a !== val);
        DB.updateUser(uid, { allergies: user.allergies });
        renderAllergyTags(user.allergies);
      }
      if (currentUser) currentUser = DB.getUserById(uid);
    }

    function saveProfile() {
      if (!currentUser) { showToast('سجل دخولك الأول', 'warning'); return; }
      const data = {
        bloodType: document.getElementById('bloodType').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value
      };
      DB.updateUser(currentUser.id, data);
      currentUser = DB.getUserById(currentUser.id);
      localStorage.setItem('cp_session', JSON.stringify({ userId: currentUser.id }));
      showToast('تم حفظ البيانات ✅', 'success');
      initMedfilePage();
    }

    // === js/ai.js ===
    /* ====================================================
       CLINIC+ — AI Medical Assistant Module
       Uses Anthropic Claude API
    ==================================================== */

    let chatHistory = [];
    let isAiLoading = false;

    const AI_SYSTEM_PROMPT = `أنت مساعد طبي ذكي لمنصة Clinic+ للرعاية الصحية في مصر.
مهمتك الأساسية:
1. شرح الروشتات الطبية للمرضى بطريقة سهلة ومبسطة باللغة العربية العامية المصرية
2. الإجابة على الأسئلة الطبية العامة بطريقة بسيطة
3. تقديم معلومات عن الأدوية الشائعة والجرعات العامة
4. نصائح صحية عامة ووقائية

قواعد مهمة:
- اكتب دايماً بالعربي العامي المصري البسيط
- كن ودود ومطمئن للمريض
- لا تضع تشخيصات طبية قاطعة
- دايماً أكد على أهمية زيارة الدكتور للتشخيص الحقيقي
- استخدم إيموجي بشكل معتدل لتبسيط الشرح
- كن مختصراً وواضحاً في ردودك`;

    function initAiPage() {
      const body = document.getElementById('chatBody');
      if (chatHistory.length === 0) {
        body.innerHTML = `
      <div class="chat-welcome">
        <div class="cw-icon"><i class="fas fa-robot"></i></div>
        <h5>أهلاً! أنا مساعدك الطبي الذكي 🤖</h5>
        <p>اسألني عن أي دواء في روشتتك، أعراض، أو أي سؤال طبي وهفيدك بالعربي.</p>
        <div class="quick-q-grid">
          <button class="qq-btn" onclick="sendQuick('اشرح لي روشتة Panadol وAmoxicillin')">🔍 اشرح روشتتي</button>
          <button class="qq-btn" onclick="sendQuick('ما هي أعراض التهاب الحلق وكيف أعالجه؟')">🤒 أعراض التهاب الحلق</button>
          <button class="qq-btn" onclick="sendQuick('ما هي التفاعلات الدوائية بين الباراسيتامول والأسبرين؟')">💊 تفاعلات دوائية</button>
          <button class="qq-btn" onclick="sendQuick('متى يجب أن أذهب للطوارئ؟')">🚨 متى أروح للطوارئ؟</button>
        </div>
      </div>`;
      }
    }

    function sendQuick(text) {
      document.getElementById('chatInput').value = text;
      sendMessage();
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text || isAiLoading) return;

      input.value = '';
      input.style.height = 'auto';
      isAiLoading = true;
      document.getElementById('sendBtn').disabled = true;

      // Remove welcome screen
      const welcome = document.querySelector('.chat-welcome');
      if (welcome) welcome.remove();

      appendUserMsg(text);
      chatHistory.push({ role: 'user', content: text });

      const typingId = showTyping();

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: AI_SYSTEM_PROMPT,
            messages: chatHistory
          })
        });

        removeTyping(typingId);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const reply = data.content?.[0]?.text || 'عذراً، حدث خطأ في الاتصال. حاول تاني.';

        chatHistory.push({ role: 'assistant', content: reply });
        appendAiMsg(reply);

      } catch (err) {
        removeTyping(typingId);
        const errMsg = err.message.includes('401') ?
          '⚠️ مفتاح API غير صالح. تأكد من إعداد الـ API Key.' :
          '⚠️ مش قادر أتصل بالخادم دلوقتي. جرب تاني بعد شوية.';
        appendAiMsg(errMsg);
      }

      isAiLoading = false;
      document.getElementById('sendBtn').disabled = false;
      input.focus();
    }

    function appendUserMsg(text) {
      const body = document.getElementById('chatBody');
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement('div');
      div.className = 'chat-msg user';
      div.innerHTML = `
    <div class="msg-bubble">${escapeHtml(text)}</div>
    <div class="msg-time">${now}</div>`;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function appendAiMsg(text) {
      const body = document.getElementById('chatBody');
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement('div');
      div.className = 'chat-msg ai';
      div.innerHTML = `
    <div class="msg-bubble">${formatAiText(text)}</div>
    <div class="msg-time">${now}</div>`;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
      const body = document.getElementById('chatBody');
      const id = 'typing_' + Date.now();
      const div = document.createElement('div');
      div.id = id;
      div.className = 'typing-bubble';
      div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return id;
    }

    function removeTyping(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }

    function clearChat() {
      chatHistory = [];
      const body = document.getElementById('chatBody');
      body.innerHTML = `
    <div class="chat-welcome">
      <div class="cw-icon"><i class="fas fa-robot"></i></div>
      <h5>المحادثة اتمسحت 🗑️</h5>
      <p>ابدأ محادثة جديدة — اسألني أي سؤال طبي!</p>
      <div class="quick-q-grid">
        <button class="qq-btn" onclick="sendQuick('اشرح لي روشتة Panadol وAmoxicillin')">🔍 اشرح روشتتي</button>
        <button class="qq-btn" onclick="sendQuick('ما هي أعراض الإنفلونزا؟')">🤒 أعراض الإنفلونزا</button>
        <button class="qq-btn" onclick="sendQuick('كيف أخفض الحرارة بسرعة؟')">🌡️ تخفيض الحرارة</button>
        <button class="qq-btn" onclick="sendQuick('ما هي فوائد فيتامين C؟')">💊 فيتامين C</button>
      </div>
    </div>`;
    }

    function chatEnter(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }

    function autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    function escapeHtml(t) {
      return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }

    function formatAiText(t) {
      return t
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }

    // === js/rating.js ===
    /* ====================================================
       CLINIC+ — Rating Module
    ==================================================== */

    let currentRating = 0;
    let miniRatings = { 1: 0, 2: 0, 3: 0 };
    let ratingDocId = 1;

    function initRatingPage() {
      setRatingDoc(ratingDocId);
      renderReviews(ratingDocId);
    }

    function setRatingDoc(docId) {
      ratingDocId = docId;
      const doc = DOCTORS.find(d => d.id === docId) || DOCTORS[0];
      const avg = DB.getAvgRating(docId) || doc.rating;
      document.getElementById('ratingDocPreview').innerHTML = `
    <div class="dmc-avatar" style="background:${doc.color}">${doc.initial}</div>
    <div>
      <div class="dmc-name">${doc.name}</div>
      <div class="dmc-meta">${doc.spec} — ${doc.area} — متوسط التقييم: ⭐ ${avg}</div>
    </div>`;
      currentRating = 0;
      updateStars(0);
      document.getElementById('ratingLabel').textContent = 'اضغط لتقييم';
      renderReviews(docId);
    }

    function setRating(val) {
      currentRating = val;
      updateStars(val);
      document.getElementById('ratingLabel').textContent = RATING_LABELS[val] || '';
    }

    function updateStars(val) {
      document.querySelectorAll('.star-i').forEach((s, i) => {
        s.classList.toggle('lit', i < val);
      });
    }

    function setMini(group, val) {
      miniRatings[group] = val;
      document.querySelectorAll(`#ms${group} span`).forEach((s, i) => {
        s.classList.toggle('lit', i < val);
      });
    }

    function submitRating() {
      if (currentRating === 0) { showToast('اختار عدد النجوم الأول', 'warning'); return; }
      const comment = document.getElementById('ratingComment').value.trim();
      const name = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'مستخدم Clinic+';

      DB.addRating({
        docId: ratingDocId, userId: currentUser ? currentUser.id : 0,
        name, rating: currentRating, comment
      });

      showToast('شكراً! تم إرسال تقييمك ⭐', 'success');
      document.getElementById('ratingComment').value = '';
      currentRating = 0;
      updateStars(0);
      document.getElementById('ratingLabel').textContent = 'اضغط لتقييم';
      [1, 2, 3].forEach(g => { miniRatings[g] = 0; setMini(g, 0); });
      renderReviews(ratingDocId);
    }

    function renderReviews(docId) {
      const reviews = DB.getRatingsByDoc(docId);
      const el = document.getElementById('reviewsList');
      if (!reviews.length) { el.innerHTML = '<p class="text-muted small text-center py-3">لا توجد تقييمات بعد — كن أول من يقيّم!</p>'; return; }
      el.innerHTML = reviews.map(r => `
    <div class="review-item">
      <div class="review-header">
        <span class="reviewer-name">${r.name}</span>
        <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      ${r.comment ? `<div class="review-text">${r.comment}</div>` : ''}
      <div class="review-date">${r.date}</div>
    </div>`).join('');
    }

    // === js/app.js ===
    /* ====================================================
       CLINIC+ — Main Application
    ==================================================== */

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
      DB.init();
      loadSession();
      navigate('home');
      animateStats();
    });

    // ---- ROUTER ----
    const protectedPages = ['medfile'];

    function navigate(page) {
      // Auth guard
      if (protectedPages.includes(page) && !currentUser) {
        showToast('لازم تسجل دخولك الأول 🔐', 'warning');
        navigate('login');
        return;
      }

      // Hide all pages
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

      // Show target page
      const target = document.getElementById(`page-${page}`);
      if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update nav active state
      document.querySelectorAll('.nav-link[data-page]').forEach(l => {
        l.classList.toggle('active-nav', l.dataset.page === page);
      });

      // Show/hide footer & navbar links for auth pages
      const authPages = ['login', 'register'];
      document.getElementById('mainFooter').style.display = authPages.includes(page) ? 'none' : '';
      document.getElementById('mainNavLinks').style.display = authPages.includes(page) ? 'none' : '';

      // Init page-specific logic
      if (page === 'home') initHomePage();
      else if (page === 'booking') initBookingPage();
      else if (page === 'prescription') initPrescriptionPage();
      else if (page === 'pharmacy') initPharmacyPage();
      else if (page === 'medfile') initMedfilePage();
      else if (page === 'ai') initAiPage();
      else if (page === 'rating') initRatingPage();
    }

    // ---- HOME PAGE ----
    function initHomePage() {
      renderHomeDoctors();
    }

    function renderHomeDoctors() {
      const top = DOCTORS.filter(d => d.avail).slice(0, 4);
      document.getElementById('homeDocList').innerHTML = top.map(d => {
        const avg = DB.getAvgRating(d.id) || d.rating;
        return `
    <div class="col-6 col-lg-3">
      <div class="doc-home-card">
        <div class="dhc-img" style="background:${gradientBg(d.color)}">
          <div class="dhc-avatar" style="background:${d.color}">${d.initial}</div>
          <div class="dhc-spec" style="background:${specColor(d.spec)}">${d.spec}</div>
        </div>
        <div class="dhc-body">
          <div class="dhc-name">${d.name}</div>
          <div class="dhc-loc"><i class="fas fa-map-marker-alt fa-xs me-1"></i>${d.area}، ${d.gov}</div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <div class="dhc-stars">${'★'.repeat(Math.floor(avg))}<small class="text-muted ms-1" style="font-size:.75rem">${avg}</small></div>
            <span class="${d.avail ? 'avail-yes' : 'avail-no'}">${d.avail ? 'متاح' : 'مشغول'}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="dhc-price">${d.price} جنيه</span>
            <small class="text-muted" style="font-size:.74rem">${d.reviews} تقييم</small>
          </div>
          <button class="btn-book-card" onclick="openBookModal(${d.id})">
            <i class="fas fa-calendar-plus me-1"></i>احجز الآن
          </button>
        </div>
      </div>
    </div>`;
      }).join('');
    }

    function gradientBg(color) {
      const map = {
        '#0A4D68': '#e8f4f8',
        '#059669': '#edfaf4',
        '#f59e0b': '#fef3e8',
        '#7c3aed': '#f5f0ff',
        '#dc2626': '#fef0f0',
        '#0891b2': '#e8f8fb',
        '#db2777': '#fef0f8',
        '#92400e': '#fef4e8',
        '#1d4ed8': '#eff3ff'
      };
      const key = Object.keys(map).find(k => color.includes(k));
      return key ? `linear-gradient(135deg, ${map[key]}, ${map[key]}dd)` : '#f0f4f8';
    }

    function specColor(spec) {
      const map = {
        'باطنة': '#0A4D68', 'أطفال': '#059669', 'أسنان': '#f59e0b',
        'قلب وأوعية دموية': '#7c3aed', 'جلدية': '#dc2626', 'عيون': '#0891b2',
        'نساء وتوليد': '#db2777', 'عظام': '#92400e', 'مسالك بولية': '#1d4ed8'
      };
      return map[spec] || '#6b7280';
    }

    // ---- STATS ANIMATION ----
    function animateStats() {
      const nums = document.querySelectorAll('.stat-num[data-target]');
      nums.forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = target % 1 !== 0;
        const duration = 1800;
        const start = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          if (isDecimal) {
            el.textContent = current.toFixed(1);
          } else {
            el.textContent = Math.floor(current).toLocaleString('ar-EG');
          }

          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    // ---- TOAST ----
    function showToast(msg, type = 'success') {
      const wrap = document.getElementById('toastWrap');
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };

      const toast = document.createElement('div');
      toast.className = `toast-item ${type !== 'success' ? type : ''}`;
      toast.innerHTML = `
    <i class="${icons[type] || icons.success} toast-icon"></i>
    <span class="toast-text">${msg}</span>`;

      wrap.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }