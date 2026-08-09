/* ══ app-core.js — state, demo data, language/role/tab switching ══ */
        let currentLang = 'ar';
        let currentRole = 'admin';
        let currentChildIndex = 0;
        let activeTab = 'dashboard';

        // Separate Datasets for Teachers & Staff
        const studentsData = [
            { id: "STU-101", name: "عبدالرحمن بن سليم", parent: "سليم بن محمد", grade: "Hifz - Juz 18", blood: "O+", phone: "+923001234501" },
            { id: "STU-102", name: "فاطمة بنت سليم", parent: "سليم بن محمد", grade: "Tajweed Rules", blood: "A+", phone: "+923001234502" },
            { id: "STU-103", name: "أحمد معاذ الفرقان", parent: "معاذ بن أحمد", grade: "Dars-e-Nizami", blood: "B-", phone: "+923001234503" },
            { id: "STU-104", name: "محمد حسیب احمد", parent: "محمد جمیل", grade: "Hifz - Juz 10", blood: "AB+", phone: "+923001234504" },
            { id: "STU-105", name: "زینب بنت علی", parent: "علی بن عثمان", grade: "Tajweed - Qaida", blood: "O-", phone: "+923001234505" },
            { id: "STU-106", name: "طلحہ بن مسعود", parent: "مسعود احمد", grade: "Dars-e-Nizami - Year 2", blood: "A-", phone: "+923001234506" },
            { id: "STU-107", name: "عائشہ بنت صدیق", parent: "ابوبکر صدیق", grade: "Hifz - Juz 5", blood: "B+", phone: "+923001234507" }
        ];

        const teachersData = [
            { id: "TCH-101", name: "الشيخ سليم بن محمد", specialization: "مدرس تجويد وحفظ", salary: "8,500 AED", status: "Paid" },
            { id: "TCH-102", name: "مفتی معاذ بن أحمد", specialization: "مدرس درس نظامی", salary: "9,000 AED", status: "Paid" },
            { id: "TCH-103", name: "قاری طارق بن محمود", specialization: "قاری شعبہ ناظرہ", salary: "7,000 AED", status: "Pending" },
            { id: "TCH-104", name: "مولانا سعید الرحمن", specialization: "مدرس فقہ و حدیث", salary: "12,000 PKR", status: "Paid" },
            { id: "TCH-105", name: "استاد محمد عثمان", specialization: "استاد عربی ادب", salary: "10,000 PKR", status: "Pending" }
        ];

        const staffData = [
            { id: "STF-101", name: "محمد فاروق", duty: "ملازم انتظام و صفائی", salary: "3,500 AED", status: "Paid" },
            { id: "STF-102", name: "عبداللہ جان", duty: "حارس أمن (سیکیورٹی گارڈ)", salary: "4,000 AED", status: "Paid" },
            { id: "STF-103", name: "حافظ ناصر", duty: "سپرنٹنڈنٹ ہوسٹل", salary: "15,000 PKR", status: "Paid" },
            { id: "STF-104", name: "محمد اقبال", duty: "باورچی (چیف کک)", salary: "18,000 PKR", status: "Pending" },
            { id: "STF-105", name: "سلیم شہزاد", duty: "ڈرائیور وین", salary: "12,000 PKR", status: "Paid" }
        ];

        const donationsData = [
            { donor: "الحاج محمد سلیم", amount: "5,000 AED", type: "Zakat", date: "2026/06/10" },
            { donor: "عمر فاروق عباسی", amount: "2,000 AED", type: "General Donation", date: "2026/06/12" },
            { donor: "فاعل خير", amount: "10,000 PKR", type: "Sadaqah", date: "2026/06/14" },
            { donor: "میاں انعام الہٰی", amount: "50,000 PKR", type: "Lillah", date: "2026/06/14" },
            { donor: "حاجی نیاز محمد", amount: "15,000 PKR", type: "Zakat", date: "2026/06/13" }
        ];

        let activeFinanceSubTab = 'summary'; // 'summary', 'entry', 'daybook', 'audit'
        let activeFeesSubSection = 'invoices'; // 'invoices', 'setup', 'generate'

        // Real transactions for daybook matching the screenshot
        const financeTransactions = [
            { id: 1, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مفتی عبدالحکیم — تنخواہ 05-2026", type: "خرچ", amount: 35000 },
            { id: 2, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "قاری محمد انور — تنخواہ 05-2026", type: "خرچ", amount: 25000 },
            { id: 3, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مولانا عبدالرحمن — تنخواہ 05-2026", type: "خرچ", amount: 22000 },
            { id: 4, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مولانا محمد ادریس — تنخواہ 05-2026", type: "خرچ", amount: 22000 },
            { id: 5, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "حافظ محمد سلیم — تنخواہ 05-2026", type: "خرچ", amount: 18000 },
            { id: 6, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مولانا عبدالباسط — تنخواہ 05-2026", type: "خرچ", amount: 20000 },
            { id: 7, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "قاری عبدالمجید — تنخواہ 05-2026", type: "خرچ", amount: 17000 },
            { id: 8, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مولانا محمد طیب — تنخواہ 05-2026", type: "خرچ", amount: 19000 },
            { id: 9, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "حافظ محمد فیصل — تنخواہ 05-2026", type: "خرچ", amount: 15000 },
            { id: 10, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "مولانا سیف اللہ — تنخواہ 05-2026", type: "خرچ", amount: 18000 },
            { id: 11, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد رمضان — تنخواہ 05-2026", type: "خرچ", amount: 13000 },
            { id: 12, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد ہونا — تنخواہ 05-2026", type: "خرچ", amount: 16000 },
            { id: 13, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "عبدالرشید — تنخواہ 05-2026", type: "خرچ", amount: 13000 },
            { id: 14, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد اقبال — تنخواہ 05-2026", type: "خرچ", amount: 14000 },
            { id: 15, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "غلام رسول — تنخواہ 05-2026", type: "خرچ", amount: 14000 },
            { id: 16, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد آصف — تنخواہ 05-2026", type: "خرچ", amount: 17000 },
            { id: 17, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد ندیم — تنخواہ 05-2026", type: "خرچ", amount: 12000 },
            { id: 18, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "عبدالغنی — تنخواہ 05-2026", type: "خرچ", amount: 12000 },
            { id: 19, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد شہباز — تنخواہ 05-2026", type: "خرچ", amount: 12000 },
            { id: 20, date: "2026-06-01", head: "تنخواہیں (خودکار)", name: "محمد عرفان — تنخواہ 05-2026", type: "خرچ", amount: 15000 },
            { id: 21, date: "2026-06-02", head: "راشن و طعام", name: "کریانہ سٹور — ماہ جون کا راشن", type: "خرچ", amount: 36000 },
            { id: 22, date: "2026-06-05", head: "بجلی، گیس و پانی", name: "لیسکو / سوئی گیس — ماہ مئی کے بل", type: "خرچ", amount: 14500 },
            { id: 23, date: "2026-06-10", head: "متفرق اخراجات", name: "دفتری اخراجات", type: "خرچ", amount: 28000 },
            { id: 24, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "مفتی عبدالحکیم — تنخواہ 06-2026", type: "خرچ", amount: 37000 },
            { id: 25, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "قاری محمد انور — تنخواہ 06-2026", type: "خرچ", amount: 25000 },
            { id: 26, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "مولانا عبدالرحمن — تنخواہ 06-2026", type: "خرچ", amount: 22000 },
            { id: 27, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "مولانا محمد ادریس — تنخواہ 06-2026", type: "خرچ", amount: 22000 },
            { id: 28, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "حافظ محمد سلیم — تنخواہ 06-2026", type: "خرچ", amount: 18000 },
            { id: 29, date: "2026-06-12", head: "تنخواہیں (خودکار)", name: "مولانا عبدالباسط — تنخواہ 06-2026", type: "خرچ", amount: 20000 },
            { id: 30, date: "2026-06-13", head: "تنخواہیں (خودکار)", name: "مولانا سیف اللہ — تنخواہ 06-2026", type: "خرچ", amount: 18000 },
            
            // Income Entries for stats demo matching totals
            { id: 31, date: "2026-06-01", head: "عطیاتِ عامہ", name: "چندہ نقدی جمعۃ المبارک", type: "آمدن", amount: 145000 },
            { id: 32, date: "2026-06-05", head: "زکوٰۃ", name: "الحاج محمد سلیم — زکوٰۃ", type: "آمدن", amount: 80000 },
            { id: 33, date: "2026-06-07", head: "چندہ تعمیرات", name: "چندہ برائے مسجد توسیع", type: "آمدن", amount: 150000 },
            { id: 34, date: "2026-06-09", head: "فیس (خودکار)", name: "فیس وصولی طلبہ — ماہ جون", type: "آمدن", amount: 22800 },
            { id: 35, date: "2026-06-12", head: "صدقات واجبہ", name: "صدقات فطر و عطایا", type: "آمدن", amount: 18000 }
        ];

        const childrenData = [
            { name: "عبدالرحمن بن سليم", grade: "حفظ (سپورہ 18)", attendance: "98%", status: "Present", fees: "500 AED Paid", sabaq: "Ruku 4, Surah Al-Kahf" },
            { name: "فاطمة بنت سليم", grade: "تجوید (قاعدہ)", attendance: "95%", status: "Present", fees: "200 AED Pending", sabaq: "Page 12, Makhraj Al-Halq" }
        ];

        const financeData = {
            transactions: [
                { invoice: "INV-001", student: "عبدالرحمن بن سليم", amount: "500 AED", status: "Paid", date: "2026/06/10" },
                { invoice: "INV-002", student: "فاطمة بنت سليم", amount: "200 AED", status: "Pending", date: "2026/06/12" },
                { invoice: "INV-003", student: "أحمد معاذ الفرقان", amount: "800 AED", status: "Paid", date: "2026/06/14" },
                { invoice: "INV-004", student: "محمد حسیب احمد", amount: "500 AED", status: "Paid", date: "2026/06/13" },
                { invoice: "INV-005", student: "زینب بنت علی", amount: "200 AED", status: "Pending", date: "2026/06/14" },
                { invoice: "INV-006", student: "طلحہ بن مسعود", amount: "800 AED", status: "Pending", date: "2026/06/14" },
                { invoice: "INV-007", student: "عائشہ بنت صدیق", amount: "500 AED", status: "Paid", date: "2026/06/15" },
                { invoice: "INV-008", student: "عبدالرحمن بن سليم", amount: "500 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-009", student: "فاطمة بنت سليم", amount: "200 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-010", student: "أحمد معاذ الفرقان", amount: "800 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-011", student: "محمد حسیب احمد", amount: "500 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-012", student: "زینب بنت علی", amount: "200 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-013", student: "طلحہ بن مسعود", amount: "800 AED", status: "Paid", date: "2026/05/10" },
                { invoice: "INV-014", student: "عائشہ بنت صدیق", amount: "500 AED", status: "Paid", date: "2026/05/10" }
            ]
        };

        const attendanceData = [
            { name: "عبدالرحمن بن سليم", status: "Present", sabaq: "پارہ 18، سورہ المومنون" },
            { name: "فاطمة بنت سليم", status: "Present", sabaq: "قاعدہ صفحہ 12" },
            { name: "أحمد معاذ الفرقان", status: "Absent", sabaq: "درس نظامی سبق 5" },
            { name: "محمد حسیب احمد", status: "Present", sabaq: "پارہ 10، سورہ الانفال" },
            { name: "زینب بنت علی", status: "Present", sabaq: "قاعدہ مخرج حروف" },
            { name: "طلحہ بن مسعود", status: "Present", sabaq: "عربی قواعد نحومیر" },
            { name: "عائشہ بنت صدیق", status: "Present", sabaq: "پارہ 5، سورہ النساء" }
        ];

        const academicsData = [
            { id: "ACAD-101", name: "حفظ القرآن الكريم (Hifz)", teacher: "الشيخ سليم بن محمد", timing: "08:00 AM - 12:00 PM", studentsCount: 15, feeAmount: 500 },
            { id: "ACAD-102", name: "تجوید و قرأت (Tajweed)", teacher: "قاری طارق بن محمود", timing: "02:00 PM - 04:00 PM", studentsCount: 22, feeAmount: 200 },
            { id: "ACAD-103", name: "درس نظامی (Dars-e-Nizami)", teacher: "مفتی معاذ بن أحمد", timing: "09:00 AM - 01:00 PM", studentsCount: 10, feeAmount: 800 },
            { id: "ACAD-104", name: "عربی زبان و ادب (Arabic Literature)", teacher: "استاد عربی عثمان", timing: "04:30 PM - 06:00 PM", studentsCount: 18, feeAmount: 400 }
        ];

        const rewardsData = [
            { studentName: "عبدالرحمن بن سليم", badge: "ممتاز الحفظ (Hifz Star)", color: "amber", reason: "بغیر غلطی تلاوت", date: "2026/06/10" },
            { studentName: "فاطمة بنت سليم", badge: "حسن السلوک (Behavior)", color: "emerald", reason: "پابندی وقت اور اچھے اخلاق", date: "2026/06/12" },
            { studentName: "أحمد معاذ الفرقان", badge: "شیرِ جامعہ (Active Student)", color: "blue", reason: "سرگرمیوں میں بہترین کارکردگی", date: "2026/06/14" },
            { studentName: "محمد حسیب احمد", badge: "ذہین طالب علم (Smart Brain)", color: "purple", reason: "سبق جلدی یاد کرنے پر", date: "2026/06/13" }
        ];

        const communicationData = {
            chats: [
                { sender: "الشيخ سليم", message: "کل صبح حفظ کلاس کا وقت پر آغاز ہوگا، تمام طلبہ وقت پر تشریف لائیں۔", time: "10:30 AM", type: "teacher" },
                { sender: "والد عبدالرحمن", message: "ان شاء اللہ، عبدالرحمن وقت پر حاضر ہوگا۔ شکریہ شیخ صاحب۔", time: "10:45 AM", type: "parent" },
                { sender: "ایڈمن آفس", message: "ماہانہ رپورٹ کارڈ جاری کر دیے گئے ہیں۔ والدین پورٹل پر چیک کریں۔", time: "11:15 AM", type: "admin" }
            ]
        };

        const galleryData = [
            { id: "GAL-01", title: "خدمتِ خلق — راشن تقسیم", category: "service", type: "image", src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400", date: "2025-05-01", desc: "جامعہ الفرقان کی جانب سے مستحق خاندانوں میں راشن تقسیم" },
            { id: "GAL-02", title: "درس نظامی — ششمابی امتحان", category: "dars", type: "image", src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400", date: "2025-04-01", desc: "طلبہ کی محنت اور لگن کا امتحان" },
            { id: "GAL-03", title: "ختم بخاری شریف و دستار بندی", category: "events", type: "image", src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400", date: "2025-03-15", desc: "جامعہ الفرقان میں ختم بخاری شریف کی پروقار تقریب — مہمانان خصوصی اور والدین کی شرکت" },
            { id: "GAL-04", title: "سالانہ کھیل کا میلہ", category: "sports", type: "image", src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400", date: "2025-02-20", desc: "طلبہ کی جسمانی تربیت اور صحت مند سرگرمیوں کا انعقاد" },
            { id: "GAL-05", title: "دورۂ قرآن کریم — حفظ مکمل", category: "hifz", type: "image", src: "https://images.unsplash.com/photo-1609599006353-e629ababfc60?auto=format&fit=crop&q=80&w=400", date: "2025-01-10", desc: "مبارک ہو! اس سال 5 طلبہ نے حفظ مکمل کیا" },
            { id: "GAL-06", title: "ماہِ رمضان — خصوصی تلاوت", category: "events", type: "video", src: "https://images.unsplash.com/photo-1584281729155-3c1b3c824968?auto=format&fit=crop&q=80&w=400", date: "2024-03-20", desc: "رمضان المبارک میں طلبہ کی تلاوت قرآن" },
            { id: "GAL-07", title: "سورہ الرحمن (الشيخ عبد الباسط)", category: "audio", type: "audio", src: "https://server8.mp3quran.net/basit/055.mp3", date: "2024-01-01", desc: "خوبصورت آواز میں تلاوت کلام پاک" }
        ];

        let currentGalleryCategory = 'all';
        let currentGalleryLayout = 'grid';
        let gallerySearchQuery = '';

        function setLanguage(lang) {
            currentLang = lang;
            const dir = (lang === 'en') ? 'ltr' : 'rtl';
            document.documentElement.dir = dir;
            document.documentElement.lang = lang;

            if (lang === 'en') {
                document.body.classList.remove('rtl-layout');
                document.body.classList.add('ltr-layout');
            } else {
                document.body.classList.remove('ltr-layout');
                document.body.classList.add('rtl-layout');
            }

            updateLocalizedUI();
            updateDashboardView();
            renderTabContent();
        }

        function setRole(role) {
            currentRole = role;
            updateDashboardView();
            // Highlight role switcher button
            document.querySelectorAll('.role-tab-btn').forEach(btn => {
                btn.classList.remove('bg-secondary', 'text-white');
                btn.classList.add('bg-gray-200', 'text-darkNeutral');
            });
            document.getElementById(`role-btn-${role}`).classList.add('bg-secondary', 'text-white');
            document.getElementById(`role-btn-${role}`).classList.remove('bg-gray-200', 'text-darkNeutral');
        }

        function switchTab(tabName, element) {
            activeTab = tabName;
            
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('bg-green-900', 'text-secondary');
                link.classList.add('text-green-100');
            });
            if (element) {
                element.classList.add('bg-green-900', 'text-secondary');
                element.classList.remove('text-green-100');
            }

            renderTabContent();
        }

        function switchChild(idx) {
            currentChildIndex = idx;
            document.querySelectorAll('.child-carousel-dot').forEach((dot, i) => {
                if (i === idx) dot.classList.add('bg-secondary');
                else dot.classList.remove('bg-secondary');
            });
            updateParentChildView();
        }

        function updateParentChildView() {
            const nameEl = document.getElementById('child-name-display');
            const gradeEl = document.getElementById('child-grade-display');
            const sabaqEl = document.getElementById('child-sabaq-display');
            if (nameEl && gradeEl && sabaqEl) {
                const child = childrenData[currentChildIndex];
                nameEl.innerText = child.name;
                gradeEl.innerText = t(child.grade);
                sabaqEl.innerText = t(child.sabaq);
            }
        }
    