/* ══ render.js — tab render engine, modals, module actions, init ══ */

        function t(key) {
            const currentDict = translations[currentLang];
            return currentDict[key] || translations['ur'][key] || key;
        }

        let modalContext = '';
        let activeDirectorySubTabs = {
            students: 'list',
            teachers: 'list',
            staff: 'list'
        };
        let activeCardItem = null;

        function renderTabContent() {
            const container = document.getElementById('main-content-container');
            const currentDict = translations[currentLang];
            let html = '';

            // User Role Switch Override
            if (currentRole === 'teacher') {
                renderTeacherView(container, currentDict);
                return;
            } else if (currentRole === 'student') {
                renderStudentView(container, currentDict);
                return;
            } else if (currentRole === 'parent') {
                renderParentView(container, currentDict);
                return;
            }

            // ADMIN SIDEBAR VIEW PORTALS
            if (activeTab === 'dashboard') {
                html = `
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
                        <div class="max-w-full">
                            <h2 class="text-2xl font-bold text-primary flex items-center gap-2 flex-wrap">
                                <i class="fa-solid fa-mosque text-secondary shrink-0"></i>
                                <span>${currentLang === 'en' ? 'Unified Administration Hub' : (currentLang === 'ur' ? 'مرکزی تعلیمی ڈیش بورڈ' : 'اللوحة الرئيسية الموحدة')}</span>
                            </h2>
                            <p class="text-xs text-gray-500 mt-1 leading-relaxed">${currentLang === 'en' ? 'Live stats and data monitors' : (currentLang === 'ur' ? 'جامعہ کے انتظامی امور کی مانیٹرنگ' : 'نظام إدارة جامعة الفرقان - تتبع وإحصائيات مباشرة')}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="triggerAction('Backup')" class="bg-primary text-white hover:bg-green-800 transition-all font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-2 min-h-[48px]">
                                <i class="fa-solid fa-cloud-arrow-up text-secondary"></i>
                                <span>${currentDict.backupBtn}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Cards Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Student Stats Section -->
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-primary">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.totalStudents}</p>
                            <h3 class="text-2xl font-bold text-primary mt-1">${studentsData.length}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-emerald-500">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.presentStudents}</p>
                            <h3 class="text-2xl font-bold text-emerald-600 mt-1">${Math.round(studentsData.length * 0.96)}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-amber-500">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.absentStudents}</p>
                            <h3 class="text-2xl font-bold text-amber-600 mt-1">${studentsData.length - Math.round(studentsData.length * 0.96)}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-red-500">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.leftStudents}</p>
                            <h3 class="text-2xl font-bold text-red-600 mt-1">12</h3>
                        </div>

                        <!-- Teacher Stats Section -->
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-secondary">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.totalTeachers}</p>
                            <h3 class="text-2xl font-bold text-secondary mt-1">${teachersData.length}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-teal-500">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.presentTeachers}</p>
                            <h3 class="text-2xl font-bold text-teal-600 mt-1">2</h3>
                        </div>
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-orange-500">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.absentTeachers}</p>
                            <h3 class="text-2xl font-bold text-orange-600 mt-1">1</h3>
                        </div>
                        <!-- Extra quick badge stats -->
                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-gray-400">
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">${currentDict.activeBadges}</p>
                            <h3 class="text-2xl font-bold text-gray-600 mt-1">48,131</h3>
                        </div>
                    </div>

                    <!-- Recent admissions table -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        <h4 class="text-base font-bold text-primary mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-clock-rotate-left text-secondary"></i>
                            <span>${currentDict.recentTransactions}</span>
                        </h4>
                        <table class="w-full text-sm text-right min-w-[600px]">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-100">
                                    <th class="py-2 px-3">${currentDict.studentName}</th>
                                    <th class="py-2 px-3">${currentDict.classGrade}</th>
                                    <th class="py-2 px-3">${currentDict.feeStatus}</th>
                                    <th class="py-2 px-3 text-left">${currentDict.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-50">
                                    <td class="py-3 px-3 font-semibold">أحمد معاذ الفرقان</td>
                                    <td class="py-3 px-3 text-gray-500">Hifz - Level 1</td>
                                    <td class="py-3 px-3 text-emerald-600 font-bold">${currentDict.paid}</td>
                                    <td class="py-3 px-3 text-gray-400 text-left">2026/06/14</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (activeTab === 'students') {
                const currentSubTab = activeDirectorySubTabs.students;
                const totalStudents = studentsData.length;
                const presentCount = Math.round(totalStudents * 0.96);
                const absentCount = totalStudents - presentCount;

                html = `
                    <div class="border-b border-gray-200 pb-4 mb-4">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                    <i class="fa-solid fa-user-graduate text-secondary"></i>
                                    <span>${t('studentsDirectory')}</span>
                                </h2>
                                <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Madarsa Management System — Student Records' : (currentLang === 'ur' ? 'مدارس مینجمنٹ سسٹم — طلبہ ریکارڈز' : 'نظام إدارة المدرسة — سجلات الطلاب')}</p>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/20">${currentLang === 'en' ? 'Total' : (currentLang === 'ur' ? 'کل طلبہ' : 'إجمالي الطلاب')}: ${totalStudents}</span>
                                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}: ${presentCount}</span>
                                <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غائب' : 'غائب')}: ${absentCount}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Horizontal Sub tabs navbar -->
                    <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 flex-wrap">
                        <button onclick="switchDirectorySubTab('students', 'list')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-list-ul ml-1"></i> ${t('listDirectory')}
                        </button>
                        <button onclick="switchDirectorySubTab('students', 'entry')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'entry' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-plus ml-1"></i> ${t('newRegistration')}
                        </button>
                        <button onclick="switchDirectorySubTab('students', 'attendance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'attendance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-calendar-days ml-1"></i> ${t('dailyAttendance')}
                        </button>
                    </div>

                    ${currentSubTab === 'list' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[650px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${t('studentId')}</th>
                                        <th class="py-2 px-3">${t('studentName')}</th>
                                        <th class="py-2 px-3">${t('parentGuardian')}</th>
                                        <th class="py-2 px-3">${t('currentCourse')}</th>
                                        <th class="py-2 px-3">${t('contact')}</th>
                                        <th class="py-2 px-3 text-left">${t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${studentsData.map((s, idx) => `
                                        <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td class="py-3 px-3 font-bold">${s.id}</td>
                                            <td class="py-3 px-3 font-semibold">${s.name}</td>
                                            <td class="py-3 px-3 text-gray-500">${s.parent}</td>
                                            <td class="py-3 px-3"><span class="bg-green-50 text-primary px-2.5 py-0.5 rounded text-xs">${t(s.grade)}</span></td>
                                            <td class="py-3 px-3 text-gray-500">${s.phone}</td>
                                            <td class="py-3 px-3 text-left flex justify-end gap-1.5">
                                                <button onclick="showIdCard('student', ${idx})" class="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100">${currentLang === 'en' ? 'Card' : (currentLang === 'ur' ? 'کارڈ' : 'بطاقة')}</button>
                                                <button onclick="deleteDirectoryItem('student', ${idx})" class="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-red-100">${t('deleteLabel')}</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : currentSubTab === 'entry' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 class="text-base font-bold text-primary mb-2">${currentLang === 'en' ? 'Register New Student' : (currentLang === 'ur' ? 'طالب علم کا نیا اندراج' : 'تسجيل طالب جديد')}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('studentName')} *</label>
                                    <input type="text" id="stu-reg-name" placeholder="مثال: عبدالرحمن" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('parentGuardian')} *</label>
                                    <input type="text" id="stu-reg-parent" placeholder="مثال: سليم بن محمد" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('currentCourse')} *</label>
                                    <input type="text" id="stu-reg-grade" placeholder="مثال: حفظ القرآن" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${currentLang === 'en' ? 'Blood Group' : (currentLang === 'ur' ? 'بلڈ گروپ' : 'فصيلة الدم')}</label>
                                    <input type="text" id="stu-reg-blood" placeholder="مثال: O+" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('contact')} *</label>
                                    <input type="text" id="stu-reg-phone" placeholder="مثال: +9715012345" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                            </div>
                            <div class="flex justify-end gap-2 pt-3 border-t">
                                <button onclick="switchDirectorySubTab('students', 'list')" class="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-xs">${currentLang === 'en' ? 'Cancel' : (currentLang === 'ur' ? 'منسوخ کریں' : 'إلغاء')}</button>
                                <button onclick="saveStudentEntry()" class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold">${currentLang === 'en' ? 'Save' : (currentLang === 'ur' ? 'محفوظ کریں' : 'حفظ')}</button>
                            </div>
                        </div>
                    ` : `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[600px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${currentLang === 'en' ? 'Student' : (currentLang === 'ur' ? 'طالب علم' : 'الطالب')}</th>
                                        <th class="py-2 px-3 text-center">${currentLang === 'en' ? 'Attendance' : (currentLang === 'ur' ? 'حاضری' : 'الحضور')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${studentsData.map((s, idx) => `
                                        <tr class="border-b border-gray-50">
                                            <td class="py-3 px-3 font-semibold">${s.name}</td>
                                            <td class="py-3 px-3 text-center">
                                                <div class="inline-flex rounded-md shadow-sm" role="group">
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-r-lg bg-emerald-500 text-white">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غیر حاضر' : 'غائب')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-l-lg bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Leave' : (currentLang === 'ur' ? 'رخصت' : 'إجازة')}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                `;
            } else if (activeTab === 'teachers') {
                const currentSubTab = activeDirectorySubTabs.teachers;
                const totalTeachers = teachersData.length;
                const presentCount = Math.round(totalTeachers * 0.9);
                const absentCount = totalTeachers - presentCount;

                html = `
                    <div class="border-b border-gray-200 pb-4 mb-4">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                    <i class="fa-solid fa-chalkboard-user text-secondary"></i>
                                    <span>${currentLang === 'en' ? 'Teachers Directory' : (currentLang === 'ur' ? 'اساتذہ کرام ڈائریکٹری' : 'سجل المعلمين والأساتذة')}</span>
                                </h2>
                                <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Madarsa Management System — Teacher Records' : (currentLang === 'ur' ? 'مدارس مینجمنٹ سسٹم — اساتذہ ریکارڈز' : 'نظام إدارة المدرسة — سجلات المعلمين')}</p>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/20">${currentLang === 'en' ? 'Total' : (currentLang === 'ur' ? 'کل اساتذہ' : 'إجمالي المعلمين')}: ${totalTeachers}</span>
                                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}: ${presentCount}</span>
                                <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غائب' : 'غائب')}: ${absentCount}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Horizontal Sub tabs navbar -->
                    <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 flex-wrap">
                        <button onclick="switchDirectorySubTab('teachers', 'list')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-list-ul ml-1"></i> ${t('listDirectory')}
                        </button>
                        <button onclick="switchDirectorySubTab('teachers', 'entry')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'entry' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-plus ml-1"></i> ${t('newRegistration')}
                        </button>
                        <button onclick="switchDirectorySubTab('teachers', 'attendance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'attendance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-calendar-days ml-1"></i> ${t('dailyAttendance')}
                        </button>
                        <button onclick="switchDirectorySubTab('teachers', 'finance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'finance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-money-bill-wave ml-1"></i> ${t('paySalaryLabel')}
                        </button>
                    </div>

                    ${currentSubTab === 'list' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[600px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${t('studentId')}</th>
                                        <th class="py-2 px-3">${t('teacherName')}</th>
                                        <th class="py-2 px-3">${t('specialization')}</th>
                                        <th class="py-2 px-3">${t('monthlySalary')}</th>
                                        <th class="py-2 px-3">${t('salaryStatus')}</th>
                                        <th class="py-2 px-3 text-left">${t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${teachersData.map((teacherItem, idx) => `
                                        <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td class="py-3 px-3 font-bold">${teacherItem.id || '---'}</td>
                                            <td class="py-3 px-3 font-semibold">${teacherItem.name}</td>
                                            <td class="py-3 px-3 text-gray-500">${t(teacherItem.specialization)}</td>
                                            <td class="py-3 px-3 font-bold text-primary">${teacherItem.salary}</td>
                                            <td class="py-3 px-3"><span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${teacherItem.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${t(teacherItem.status)}</span></td>
                                            <td class="py-3 px-3 text-left flex justify-end gap-1.5">
                                                <button onclick="showIdCard('teacher', ${idx})" class="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100">${currentLang === 'en' ? 'Card' : (currentLang === 'ur' ? 'کارڈ' : 'بطاقة')}</button>
                                                <button onclick="selectSalaryItem('teacher', ${idx})" class="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-green-100">${currentLang === 'en' ? 'Salary' : (currentLang === 'ur' ? 'تنخواہ' : 'الراتب')}</button>
                                                <button onclick="deleteDirectoryItem('teacher', ${idx})" class="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-red-100">${t('deleteLabel')}</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : currentSubTab === 'entry' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 class="text-base font-bold text-primary mb-2">${currentLang === 'en' ? 'Register New Teacher' : (currentLang === 'ur' ? 'استاد کا نیا اندراج' : 'تسجيل معلم جديد')}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('teacherName')} *</label>
                                    <input type="text" id="teach-reg-name" placeholder="مثال: الشيخ سليم بن محمد" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${currentLang === 'en' ? 'Father Name' : (currentLang === 'ur' ? 'والد کا نام' : 'اسم الأب')}</label>
                                    <input type="text" id="teach-reg-father" placeholder="والد کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('specialization')} *</label>
                                    <input type="text" id="teach-reg-spec" placeholder="مثال: مدرس تجويد وحفظ" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('monthlySalary')} *</label>
                                    <input type="text" id="teach-reg-sal" placeholder="مثال: 8,500 AED" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${currentLang === 'en' ? 'Qualification' : (currentLang === 'ur' ? 'تعلیمی قابلیت' : 'المؤهل الأكاديمي')}</label>
                                    <input type="text" id="teach-reg-qual" placeholder="مثال: درس نظامی (فاضل)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('contact')}</label>
                                    <input type="text" id="teach-reg-phone" placeholder="مثال: +923001234567" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                            </div>
                            <div class="flex justify-end gap-2 pt-3 border-t">
                                <button onclick="switchDirectorySubTab('teachers', 'list')" class="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-xs">${currentLang === 'en' ? 'Cancel' : (currentLang === 'ur' ? 'منسوخ کریں' : 'إلغاء')}</button>
                                <button onclick="saveTeacherEntry()" class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold">${currentLang === 'en' ? 'Save' : (currentLang === 'ur' ? 'محفوظ کریں' : 'حفظ')}</button>
                            </div>
                        </div>
                    ` : currentSubTab === 'attendance' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[600px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${t('teacherName')}</th>
                                        <th class="py-2 px-3 text-center">${currentLang === 'en' ? 'Attendance' : (currentLang === 'ur' ? 'حاضری' : 'الحضور')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${teachersData.map((t, idx) => `
                                        <tr class="border-b border-gray-50">
                                            <td class="py-3 px-3 font-semibold">${t.name}</td>
                                            <td class="py-3 px-3 text-center">
                                                <div class="inline-flex rounded-md shadow-sm" role="group">
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-r-lg bg-emerald-500 text-white">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غیر حاضر' : 'غائب')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-l-lg bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Leave' : (currentLang === 'ur' ? 'رخصت' : 'إجازة')}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <h3 class="text-base font-bold text-primary mb-2">${currentLang === 'en' ? 'Salary Payment Slip' : (currentLang === 'ur' ? 'تنخواہ کی ادائیگی اور سلپ' : 'كشف صرف الرواتب')}</h3>
                            <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h4 class="font-bold text-primary text-sm">${activeSalaryItem ? activeSalaryItem.name : (currentLang === 'en' ? 'Select teacher (from the list)' : (currentLang === 'ur' ? 'استاد منتخب کریں (فہرست میں جا کر)' : 'اختر المعلم (من القائمة)'))}</h4>
                                    <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Duty' : (currentLang === 'ur' ? 'عہدہ' : 'الوظيفة')}: ${activeSalaryItem ? t(activeSalaryItem.specialization) : '---'}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-gray-400 font-bold">${currentLang === 'en' ? 'Fixed Salary' : (currentLang === 'ur' ? 'مقررہ تنخواہ' : 'الراتب المحدد')}</p>
                                    <p class="text-lg font-bold text-primary mt-0.5">${activeSalaryItem ? activeSalaryItem.salary : '0 AED'}</p>
                                </div>
                            </div>
                            
                            ${activeSalaryItem ? `
                                <div class="space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" id="sal-log-amount" value="${activeSalaryItem.salary}" placeholder="${currentLang === 'en' ? 'Payment Amount' : (currentLang === 'ur' ? 'ادائیگی کی رقم' : 'مبلغ الصرف')}" class="border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                        <button onclick="paySalary()" class="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">${currentLang === 'en' ? 'Save Salary Payment' : (currentLang === 'ur' ? 'تنخواہ کی ادائیگی محفوظ کریں' : 'حفظ عملية صرف الراتب')}</button>
                                    </div>
                                    <div class="border-t border-gray-100 pt-4">
                                        <h4 class="font-bold text-xs text-gray-400 mb-2">${currentLang === 'en' ? 'Payment History' : (currentLang === 'ur' ? 'ادائیگیوں کی تاریخ' : 'سجل الصرف والمدفوعات')}</h4>
                                        <table class="w-full text-xs text-right">
                                            <thead>
                                                <tr class="text-gray-400 border-b border-gray-100">
                                                    <th class="py-2">${currentLang === 'en' ? 'Month' : (currentLang === 'ur' ? 'مہینہ' : 'الشهر')}</th>
                                                    <th class="py-2">${currentLang === 'en' ? 'Basic Salary' : (currentLang === 'ur' ? 'بنیادی تنخواہ' : 'الراتب الأساسي')}</th>
                                                    <th class="py-2 text-left">${currentLang === 'en' ? 'Status' : (currentLang === 'ur' ? 'حالت' : 'الحالة')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="border-b border-gray-50">
                                                    <td class="py-2 font-bold">June 2026</td>
                                                    <td class="py-2">${activeSalaryItem.salary}</td>
                                                    <td class="py-2 text-left"><span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">${t('Paid')}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `}
                `;
            } else if (activeTab === 'staff') {
                const currentSubTab = activeDirectorySubTabs.staff;
                const totalStaff = staffData.length;
                const presentCount = Math.round(totalStaff * 0.9);
                const absentCount = totalStaff - presentCount;

                html = `
                    <div class="border-b border-gray-200 pb-4 mb-4">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                    <i class="fa-solid fa-users text-secondary"></i>
                                    <span>${t('supportStaff')}</span>
                                </h2>
                                <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Madarsa Management System — Staff Records' : (currentLang === 'ur' ? 'مدارس مینجمنٹ سسٹم — ملازمین ریکارڈز' : 'نظام إدارة المدرسة — سجل الموظفين المساعدين')}</p>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/20">${currentLang === 'en' ? 'Total' : (currentLang === 'ur' ? 'کل عملہ' : 'إجمالي الموظفين')}: ${totalStaff}</span>
                                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}: ${presentCount}</span>
                                <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غائب' : 'غائب')}: ${absentCount}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Horizontal Sub tabs navbar -->
                    <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 flex-wrap">
                        <button onclick="switchDirectorySubTab('staff', 'list')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-list-ul ml-1"></i> ${t('listDirectory')}
                        </button>
                        <button onclick="switchDirectorySubTab('staff', 'entry')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'entry' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-plus ml-1"></i> ${t('newRegistration')}
                        </button>
                        <button onclick="switchDirectorySubTab('staff', 'attendance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'attendance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-calendar-days ml-1"></i> ${t('dailyAttendance')}
                        </button>
                        <button onclick="switchDirectorySubTab('staff', 'finance')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentSubTab === 'finance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}">
                            <i class="fa-solid fa-money-bill-wave ml-1"></i> ${t('paySalaryLabel')}
                        </button>
                    </div>

                    ${currentSubTab === 'list' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[600px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${t('studentId')}</th>
                                        <th class="py-2 px-3">${t('staffName')}</th>
                                        <th class="py-2 px-3">${t('dutyRole')}</th>
                                        <th class="py-2 px-3">${t('monthlySalary')}</th>
                                        <th class="py-2 px-3">${t('salaryStatus')}</th>
                                        <th class="py-2 px-3 text-left">${t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${staffData.map((st, idx) => `
                                        <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td class="py-3 px-3 font-bold">${st.id || '---'}</td>
                                            <td class="py-3 px-3 font-semibold">${st.name}</td>
                                            <td class="py-3 px-3 text-gray-500">${t(st.duty)}</td>
                                            <td class="py-3 px-3 font-bold text-primary">${st.salary}</td>
                                            <td class="py-3 px-3"><span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${st.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${t(st.status)}</span></td>
                                            <td class="py-3 px-3 text-left flex justify-end gap-1.5">
                                                <button onclick="showIdCard('staff', ${idx})" class="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100">${currentLang === 'en' ? 'Card' : (currentLang === 'ur' ? 'کارڈ' : 'بطاقة')}</button>
                                                <button onclick="selectSalaryItem('staff', ${idx})" class="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-green-100">${currentLang === 'en' ? 'Salary' : (currentLang === 'ur' ? 'تنخواہ' : 'الراتب')}</button>
                                                <button onclick="deleteDirectoryItem('staff', ${idx})" class="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-red-100">${t('deleteLabel')}</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : currentSubTab === 'entry' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 class="text-base font-bold text-primary mb-2">${currentLang === 'en' ? 'Register New Staff Member' : (currentLang === 'ur' ? 'نیا اسٹاف ممبر شامل کریں' : 'تسجيل موظف جديد')}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('staffName')} *</label>
                                    <input type="text" id="staff-reg-name" placeholder="مثال: محمد فاروق" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${currentLang === 'en' ? 'Father Name' : (currentLang === 'ur' ? 'والد کا نام' : 'اسم الأب')}</label>
                                    <input type="text" id="staff-reg-father" placeholder="والد کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('dutyRole')} *</label>
                                    <input type="text" id="staff-reg-role" placeholder="مثال: حارس أمن" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('monthlySalary')} *</label>
                                    <input type="text" id="staff-reg-sal" placeholder="مثال: 3,500 AED" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 font-bold mb-1">${t('contact')}</label>
                                    <input type="text" id="staff-reg-phone" placeholder="مثال: +923001234567" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                                </div>
                            </div>
                            <div class="flex justify-end gap-2 pt-3 border-t">
                                <button onclick="switchDirectorySubTab('staff', 'list')" class="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-xs">${currentLang === 'en' ? 'Cancel' : (currentLang === 'ur' ? 'منسوخ کریں' : 'إلغاء')}</button>
                                <button onclick="saveStaffEntry()" class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold">${currentLang === 'en' ? 'Save' : (currentLang === 'ur' ? 'محفوظ کریں' : 'حفظ')}</button>
                            </div>
                        </div>
                    ` : currentSubTab === 'attendance' ? `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                            <table class="w-full text-sm text-right min-w-[600px]">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100">
                                        <th class="py-2 px-3">${t('staffName')}</th>
                                        <th class="py-2 px-3 text-center">${currentLang === 'en' ? 'Attendance' : (currentLang === 'ur' ? 'حاضری' : 'الحضور')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${staffData.map((st, idx) => `
                                        <tr class="border-b border-gray-50">
                                            <td class="py-3 px-3 font-semibold">${st.name}</td>
                                            <td class="py-3 px-3 text-center">
                                                <div class="inline-flex rounded-md shadow-sm" role="group">
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-r-lg bg-emerald-500 text-white">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غیر حاضر' : 'غائب')}</button>
                                                    <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-l-lg bg-gray-100 text-gray-500 hover:bg-gray-200">${currentLang === 'en' ? 'Leave' : (currentLang === 'ur' ? 'رخصت' : 'إجازة')}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <h3 class="text-base font-bold text-primary mb-2">${currentLang === 'en' ? 'Salary Payment Slip' : (currentLang === 'ur' ? 'تنخواہ کی ادائیگی اور سلپ' : 'كشف صرف الرواتب')}</h3>
                            <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h4 class="font-bold text-primary text-sm">${activeSalaryItem ? activeSalaryItem.name : (currentLang === 'en' ? 'Select staff member (from the list)' : (currentLang === 'ur' ? 'ملازم منتخب کریں (فہرست میں جا کر)' : 'اختر الموظف (من القائمة)'))}</h4>
                                    <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Duty' : (currentLang === 'ur' ? 'عہدہ' : 'الوظيفة')}: ${activeSalaryItem ? t(activeSalaryItem.duty) : '---'}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-gray-400 font-bold">${currentLang === 'en' ? 'Fixed Salary' : (currentLang === 'ur' ? 'مقررہ تنخواہ' : 'الراتب المحدد')}</p>
                                    <p class="text-lg font-bold text-primary mt-0.5">${activeSalaryItem ? activeSalaryItem.salary : '0 AED'}</p>
                                </div>
                            </div>
                            
                            ${activeSalaryItem ? `
                                <div class="space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" id="sal-log-amount" value="${activeSalaryItem.salary}" placeholder="${currentLang === 'en' ? 'Payment Amount' : (currentLang === 'ur' ? 'ادائیگی کی رقم' : 'مبلغ الصرف')}" class="border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                        <button onclick="paySalary()" class="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">${currentLang === 'en' ? 'Save Salary Payment' : (currentLang === 'ur' ? 'تنخواہ کی ادائیگی محفوظ کریں' : 'حفظ عملية صرف الراتب')}</button>
                                    </div>
                                    <div class="border-t border-gray-100 pt-4">
                                        <h4 class="font-bold text-xs text-gray-400 mb-2">${currentLang === 'en' ? 'Payment History' : (currentLang === 'ur' ? 'ادائیگیوں کی تاریخ' : 'سجل الصرف والمدفوعات')}</h4>
                                        <table class="w-full text-xs text-right">
                                            <thead>
                                                <tr class="text-gray-400 border-b border-gray-100">
                                                    <th class="py-2">${currentLang === 'en' ? 'Month' : (currentLang === 'ur' ? 'مہینہ' : 'الشهر')}</th>
                                                    <th class="py-2">${currentLang === 'en' ? 'Basic Salary' : (currentLang === 'ur' ? 'بنیادی تنخواہ' : 'الراتب الأساسي')}</th>
                                                    <th class="py-2 text-left">${currentLang === 'en' ? 'Status' : (currentLang === 'ur' ? 'حالت' : 'الحالة')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="border-b border-gray-50">
                                                    <td class="py-2 font-bold">June 2026</td>
                                                    <td class="py-2">${activeSalaryItem.salary}</td>
                                                    <td class="py-2 text-left"><span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">${t('Paid')}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `}
                `;
            } else if (activeTab === 'donations') {
                html = `
                    <div class="flex justify-between items-center border-b border-gray-200 pb-4">
                        <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                            <i class="fa-solid fa-hand-holding-heart text-secondary"></i>
                            <span>${t('donationsRegister')}</span>
                        </h2>
                        <button onclick="openAddModal('donation')" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                            <i class="fa-solid fa-plus text-secondary"></i>
                            <span>${t('recordDonation')}</span>
                        </button>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table class="w-full text-sm text-right min-w-[600px]">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-100">
                                    <th class="py-2 px-3">${t('donorName')}</th>
                                    <th class="py-2 px-3">${t('amount')}</th>
                                    <th class="py-2 px-3">${t('donationType')}</th>
                                    <th class="py-2 px-3 text-left">${t('receiptDate')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${donationsData.map(d => `
                                    <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td class="py-3 px-3 font-semibold">${d.donor}</td>
                                        <td class="py-3 px-3 font-bold text-emerald-600">${d.amount}</td>
                                        <td class="py-3 px-3"><span class="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs">${t(d.type)}</span></td>
                                        <td class="py-3 px-3 text-gray-400 text-left">${d.date}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (activeTab === 'attendance') {
                html = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                <i class="fa-solid fa-calendar-check text-secondary"></i>
                                <span>${t('attendanceSabaqRegister')}</span>
                            </h2>
                            <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Mark attendance and daily Quran lesson' : (currentLang === 'ur' ? 'روزانہ حاضری اور سبق درج کریں' : 'تسجيل حضور الطلاب والسبق اليومي')}</p>
                        </div>
                        <button onclick="saveAttendance()" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                            <i class="fa-solid fa-check text-secondary"></i>
                            <span>${t('saveAttendanceLabel')}</span>
                        </button>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table class="w-full text-sm text-right min-w-[600px]">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-100">
                                    <th class="py-2 px-3">${currentLang === 'en' ? 'Student' : (currentLang === 'ur' ? 'طالب علم' : 'الطالب')}</th>
                                    <th class="py-2 px-3 text-center">${currentLang === 'en' ? 'Status' : (currentLang === 'ur' ? 'حاضری حالت' : 'حالة الحضور')}</th>
                                    <th class="py-2 px-3">${t('todaysLesson')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attendanceData.map((att, i) => `
                                    <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td class="py-3 px-3 font-semibold">${att.name}</td>
                                        <td class="py-3 px-3 text-center col-span-1">
                                            <select onchange="updateAttendanceStatus(${i}, this.value)" class="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-secondary">
                                                <option value="Present" ${att.status === 'Present' ? 'selected' : ''}>${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}</option>
                                                <option value="Absent" ${att.status === 'Absent' ? 'selected' : ''}>${currentLang === 'en' ? 'Absent' : (currentLang === 'ur' ? 'غائب' : 'غائب')}</option>
                                                <option value="Late" ${att.status === 'Late' ? 'selected' : ''}>${currentLang === 'en' ? 'Late' : (currentLang === 'ur' ? 'دیر سے' : 'متأخر')}</option>
                                            </select>
                                        </td>
                                        <td class="py-3 px-3">
                                            <input type="text" value="${att.sabaq}" onchange="updateAttendanceSabaq(${i}, this.value)" class="w-full max-w-xs border border-gray-200 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-secondary">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (activeTab === 'finance') {
                // Let's compute stats dynamically
                let totalIncome = 0;
                let totalExpense = 0;
                let zakatBalance = 45000; // Hardcoded default or computed

                financeTransactions.forEach(t => {
                    if (t.type === 'آمدن') {
                        totalIncome += t.amount;
                    } else if (t.type === 'خرچ') {
                        totalExpense += t.amount;
                    }
                });

                let netBalance = totalIncome - totalExpense;

                // Build category-wise summary
                const categorySummary = {};
                // Pre-populate standard heads to match screenshot
                const standardHeads = [
                    "بجلی، گیس و پانی", "تعمیرات", "تنخواہیں (خودکار)", "راشن و طعام", 
                    "زکوٰۃ", "صدقات واجبہ", "عطیاتِ عامہ", "فیس (خودکار)", 
                    "متفرق اخراجات", "مرمت و دیکھ بھال", "مستحقین پر زکوٰۃ کی ادائیگی", 
                    "وظیفہ (خودکار)", "چندہ تعمیرات", "کتب و قرطاسیہ"
                ];
                standardHeads.forEach(h => {
                    categorySummary[h] = { income: 0, expense: 0 };
                });

                // Populate with actual data
                financeTransactions.forEach(t => {
                    if (!categorySummary[t.head]) {
                        categorySummary[t.head] = { income: 0, expense: 0 };
                    }
                    if (t.type === 'آمدن') {
                        categorySummary[t.head].income += t.amount;
                    } else if (t.type === 'خرچ') {
                        categorySummary[t.head].expense += t.amount;
                    }
                });

                // Render sub-navigation bar & layout
                html = `
                    <div class="flex flex-col gap-6">
                        <!-- Top Navigation & Stats -->
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
                                    <i class="fa-solid fa-file-invoice-dollar text-secondary"></i>
                                    <span>${t('financialHub')}</span>
                                </h2>
                                <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Madarsa Management System — Accounting Register' : (currentLang === 'ur' ? 'مدارس مینجمنٹ سسٹم — اکاؤنٹنگ رجسٹر' : 'نظام إدارة المدرسة — سجل الحسابات')}</p>
                            </div>
                            
                            <!-- Premium Top Cards matching first screenshot -->
                            <div class="flex gap-3 flex-wrap">
                                <div class="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-right">
                                    <span class="text-[10px] text-emerald-800 font-bold block">${t('totalIncomeLabel')}</span>
                                    <span class="text-sm font-extrabold text-emerald-700">Rs ${totalIncome.toLocaleString()}</span>
                                </div>
                                <div class="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-right">
                                    <span class="text-[10px] text-red-800 font-bold block">${t('totalExpenseLabel')}</span>
                                    <span class="text-sm font-extrabold text-red-700">Rs ${totalExpense.toLocaleString()}</span>
                                </div>
                                <div class="${netBalance >= 0 ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'} px-4 py-2 rounded-lg text-right">
                                    <span class="text-[10px] text-gray-700 font-bold block">${t('balanceLabel')}</span>
                                    <span class="text-sm font-extrabold ${netBalance >= 0 ? 'text-blue-700' : 'text-amber-700'}">Rs ${netBalance.toLocaleString()}${netBalance < 0 ? '-' : ''}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sub navigation tabs -->
                        <div class="flex items-center gap-2 border-b pb-1 overflow-x-auto">
                            <button onclick="activeFinanceSubTab = 'summary'; renderTabContent();" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFinanceSubTab === 'summary' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                <i class="fa-solid fa-chart-pie"></i>
                                <span>${t('summary')}</span>
                            </button>
                            <button onclick="activeFinanceSubTab = 'entry'; renderTabContent();" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFinanceSubTab === 'entry' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                <i class="fa-solid fa-plus"></i>
                                <span>${t('newEntry')}</span>
                            </button>
                            <button onclick="activeFinanceSubTab = 'daybook'; renderTabContent();" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFinanceSubTab === 'daybook' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                <i class="fa-solid fa-book"></i>
                                <span>${t('daybook')}</span>
                            </button>
                            <button onclick="activeFinanceSubTab = 'audit'; renderTabContent();" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFinanceSubTab === 'audit' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                <i class="fa-solid fa-file-shield"></i>
                                <span>${t('auditReport')}</span>
                            </button>
                            <button onclick="activeFinanceSubTab = 'fees'; renderTabContent();" class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFinanceSubTab === 'fees' ? 'bg-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                <i class="fa-solid fa-wallet"></i>
                                <span>${t('feeManagement')}</span>
                            </button>
                        </div>

                        <!-- Content Render based on active sub tab -->
                        ${activeFinanceSubTab === 'summary' ? `
                            <!-- Tab: Accounts Summary (Screenshot 3 style) -->
                            <div class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-emerald-600 text-right">
                                        <p class="text-[11px] text-gray-400 font-bold">${t('totalIncomeLabel')} (${t('amountLabel')})</p>
                                        <h3 class="text-2xl font-bold text-emerald-600 mt-1">${totalIncome.toLocaleString()}</h3>
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-red-600 text-right">
                                        <p class="text-[11px] text-gray-400 font-bold">${t('totalExpenseLabel')} (${t('amountLabel')})</p>
                                        <h3 class="text-2xl font-bold text-red-600 mt-1">${totalExpense.toLocaleString()}</h3>
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-blue-600 text-right">
                                        <p class="text-[11px] text-gray-400 font-bold">${t('currentBalance')}</p>
                                        <h3 class="text-2xl font-bold text-blue-600 mt-1">${netBalance.toLocaleString()}</h3>
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-secondary text-right">
                                        <p class="text-[11px] text-gray-400 font-bold">${t('zakatBalanceLabel')}</p>
                                        <h3 class="text-2xl font-bold text-secondary mt-1">${zakatBalance.toLocaleString()}</h3>
                                    </div>
                                </div>

                                <!-- Summary Table -->
                                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                    <h4 class="text-sm font-bold text-primary mb-4">${t('accountsSummary')}</h4>
                                    <table class="w-full text-xs text-right min-w-[500px]">
                                        <thead>
                                            <tr class="text-gray-400 border-b border-gray-100">
                                                <th class="py-2 px-3">${t('accountHead')}</th>
                                                <th class="py-2 px-3">${t('income')}</th>
                                                <th class="py-2 px-3">${t('expense')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${Object.keys(categorySummary).map(head => {
                                                const d = categorySummary[head];
                                                if (d.income === 0 && d.expense === 0) return ''; // Skip empty rows for cleaner look
                                                return `
                                                    <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                                        <td class="py-3 px-3 font-semibold text-gray-700">${t(head)}</td>
                                                        <td class="py-3 px-3 font-bold text-emerald-600">${d.income > 0 ? d.income.toLocaleString() : '—'}</td>
                                                        <td class="py-3 px-3 font-bold text-red-500">${d.expense > 0 ? d.expense.toLocaleString() : '—'}</td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                    
                                    <p class="text-[11px] text-gray-400 mt-6 leading-relaxed border-t pt-4">
                                        ${t('financeDisclaimer')}
                                    </p>
                                </div>
                            </div>
                        ` : activeFinanceSubTab === 'entry' ? `
                            <!-- Tab: New Entry Form (Screenshot 1 style) -->
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                                <h3 class="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                                    <i class="fa-solid fa-plus-circle text-secondary"></i>
                                    <span>${t('newEntry')} (${t('income')} / ${t('expense')})</span>
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('typeLabel')}</label>
                                        <select id="fin-entry-type" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                            <option value="آمدن">${t('income')}</option>
                                            <option value="خرچ">${t('expense')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('accountHead')}</label>
                                        <select id="fin-entry-head" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                            ${standardHeads.map(h => `<option value="${h}">${h}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('nameLabel')}</label>
                                        <input list="fin-people-dl" id="fin-entry-name" placeholder="مثلاً: حاجی محمد صاحب یا آئی ڈی" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                        <datalist id="fin-people-dl">
                                            ${[
                                                ...studentsData.map(s => ({ name: s.name, id: s.id, type: 'Student' })),
                                                ...teachersData.map(t => ({ name: t.name, id: t.id, type: 'Teacher' })),
                                                ...staffData.map(st => ({ name: st.name, id: st.id, type: 'Staff' }))
                                            ].map(p => `<option value="${p.name} (${p.id})">${p.id} - ${p.name} (${p.type})</option>`).join('')}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('amountLabel')}</label>
                                        <input type="number" id="fin-entry-amount" placeholder="رقم درج کریں" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('dateLabel')}</label>
                                        <input type="date" id="fin-entry-date" value="2026-06-14" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                    </div>
                                    <div class="md:col-span-3">
                                        <label class="block text-xs font-bold text-gray-500 mb-1">${t('descLabel')}</label>
                                        <input type="text" id="fin-entry-desc" placeholder="اضافی تفصیلات" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                    </div>
                                </div>

                                <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                                    <button onclick="saveFinanceEntry()" class="bg-secondary hover:bg-yellow-500 text-primary font-bold px-6 py-2.5 rounded-lg text-xs transition-all flex items-center gap-2">
                                        <i class="fa-solid fa-receipt"></i>
                                        <span>${t('saveAndReceipt')}</span>
                                    </button>
                                </div>
                            </div>
                        ` : activeFinanceSubTab === 'daybook' ? `
                            <!-- Tab: Daybook Ledger (Screenshot 2 style) -->
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-xl border border-gray-100 flex flex-wrap items-end gap-3 justify-between">
                                    <div class="flex gap-3 flex-wrap">
                                        <div>
                                            <label class="block text-[10px] font-bold text-gray-400 mb-1">${t('fromDate')}</label>
                                            <input type="date" id="daybook-filter-start" value="2026-06-01" class="border p-2 rounded text-xs">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-bold text-gray-400 mb-1">${t('toDate')}</label>
                                            <input type="date" id="daybook-filter-end" value="2026-06-14" class="border p-2 rounded text-xs">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-bold text-gray-400 mb-1">${t('selectAccount')}</label>
                                            <select id="daybook-filter-head" class="border p-2 rounded text-xs">
                                                <option value="all">${t('all') || 'All'}</option>
                                                ${standardHeads.map(h => `<option value="${h}">${h}</option>`).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <button onclick="renderTabContent()" class="bg-primary text-white hover:bg-green-800 font-bold px-4 py-2 rounded text-xs">${t('showDaybook')}</button>
                                </div>

                                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                    <table class="w-full text-xs text-right min-w-[700px]">
                                        <thead>
                                            <tr class="text-gray-400 border-b border-gray-100">
                                                <th class="py-2 px-3">${t('dateLabel')}</th>
                                                <th class="py-2 px-3">${t('selectAccount')}</th>
                                                <th class="py-2 px-3">${t('nameLabel')}</th>
                                                <th class="py-2 px-3">${t('income')}</th>
                                                <th class="py-2 px-3">${t('expense')}</th>
                                                <th class="py-2 px-3 text-left">${t('action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${(() => {
                                                // Local filters
                                                const startEl = document.getElementById('daybook-filter-start');
                                                const endEl = document.getElementById('daybook-filter-end');
                                                const headEl = document.getElementById('daybook-filter-head');
                                                
                                                const startDate = startEl ? startEl.value : '2026-06-01';
                                                const endDate = endEl ? endEl.value : '2026-06-14';
                                                const headVal = headEl ? headEl.value : 'all';

                                                let incomeSum = 0;
                                                let expenseSum = 0;

                                                const filtered = financeTransactions.filter(t => {
                                                    const isAfter = t.date >= startDate;
                                                    const isBefore = t.date <= endDate;
                                                    const matchesHead = headVal === 'all' || t.head === headVal;
                                                    return isAfter && isBefore && matchesHead;
                                                });

                                                filtered.sort((a,b) => a.date.localeCompare(b.date));

                                                const rowsHtml = filtered.map((tx, idx) => {
                                                    if (tx.type === 'آمدن') incomeSum += tx.amount;
                                                    else if (tx.type === 'خرچ') expenseSum += tx.amount;

                                                    return `
                                                        <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                                            <td class="py-3 px-3 text-gray-500">${tx.date}</td>
                                                            <td class="py-3 px-3 font-semibold text-gray-700">${t(tx.head)}</td>
                                                            <td class="py-3 px-3 text-gray-600">${tx.name}</td>
                                                            <td class="py-3 px-3 font-bold text-emerald-600">${tx.type === 'آمدن' ? tx.amount.toLocaleString() : '—'}</td>
                                                            <td class="py-3 px-3 font-bold text-red-500">${tx.type === 'خرچ' ? tx.amount.toLocaleString() : '—'}</td>
                                                            <td class="py-3 px-3 text-left">
                                                                <button onclick="deleteFinanceEntry(${tx.id})" class="text-red-500 hover:text-red-700 font-bold ml-2">${t('deleteLabel')}</button>
                                                                <button onclick="alert('رسیڈ نمبر ${tx.id} پرنٹ ہو رہی ہے')" class="text-blue-500 hover:text-blue-700 font-bold">${t('receiptLabel')}</button>
                                                            </td>
                                                        </tr>
                                                    `;
                                                }).join('');

                                                const bal = incomeSum - expenseSum;

                                                return rowsHtml + `
                                                    <!-- Totals row -->
                                                    <tr class="bg-gray-50 font-bold border-t-2 border-gray-200">
                                                        <td class="py-3 px-3" colspan="3">میزان</td>
                                                        <td class="py-3 px-3 text-emerald-600">${incomeSum.toLocaleString()}</td>
                                                        <td class="py-3 px-3 text-red-500">${expenseSum.toLocaleString()}</td>
                                                        <td class="py-3 px-3 text-left text-blue-700">بچت: ${bal.toLocaleString()}</td>
                                                    </tr>
                                                `;
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : activeFinanceSubTab === 'fees' ? `
                            <!-- Tab: Fees Management -->
                            <div class="space-y-6">
                                <!-- Inner Navigation for Fees -->
                                <div class="flex items-center gap-2 border-b pb-1 overflow-x-auto">
                                    <button onclick="activeFeesSubSection = 'invoices'; renderTabContent();" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFeesSubSection === 'invoices' ? 'bg-secondary text-primary' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                        <i class="fa-solid fa-file-invoice"></i>
                                        <span>${currentLang === 'en' ? 'Fee Invoices' : (currentLang === 'ur' ? 'چالان لسٹ' : 'فواتير الرسوم')}</span>
                                    </button>
                                    <button onclick="activeFeesSubSection = 'setup'; renderTabContent();" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFeesSubSection === 'setup' ? 'bg-secondary text-primary' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                        <i class="fa-solid fa-sliders"></i>
                                        <span>${currentLang === 'en' ? 'Class Fees Setup' : (currentLang === 'ur' ? 'کلاس فیس سیٹ اپ' : 'إعداد رسوم الفصول')}</span>
                                    </button>
                                    <button onclick="activeFeesSubSection = 'generate'; renderTabContent();" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeFeesSubSection === 'generate' ? 'bg-secondary text-primary' : 'bg-white text-gray-600 border hover:bg-gray-50'}">
                                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                                        <span>${currentLang === 'en' ? 'Generate Monthly Invoices' : (currentLang === 'ur' ? 'ماہانہ فیس جنریٹ کریں' : 'توليد فواتير شهرية')}</span>
                                    </button>
                                </div>

                                ${activeFeesSubSection === 'invoices' ? `
                                    <!-- Stats Cards -->
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-primary text-right">
                                            <p class="text-[11px] text-gray-400 font-bold">${t('total')} ${t('feeManagement')}</p>
                                            <h3 class="text-2xl font-bold text-primary mt-1">
                                                ${(() => {
                                                    let total = 0;
                                                    financeData.transactions.forEach(tx => {
                                                        const amt = parseFloat(tx.amount);
                                                        if (!isNaN(amt)) total += amt;
                                                    });
                                                    return total;
                                                })()} AED
                                            </h3>
                                        </div>
                                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-emerald-600 text-right">
                                            <p class="text-[11px] text-gray-400 font-bold">${t('paid')}</p>
                                            <h3 class="text-2xl font-bold text-emerald-600 mt-1">
                                                ${(() => {
                                                    let total = 0;
                                                    financeData.transactions.forEach(tx => {
                                                        if (tx.status === 'Paid') {
                                                            const amt = parseFloat(tx.amount);
                                                            if (!isNaN(amt)) total += amt;
                                                        }
                                                    });
                                                    return total;
                                                })()} AED
                                            </h3>
                                        </div>
                                        <div class="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-amber-600 text-right">
                                            <p class="text-[11px] text-gray-400 font-bold">${t('pending')}</p>
                                            <h3 class="text-2xl font-bold text-amber-600 mt-1">
                                                ${(() => {
                                                    let total = 0;
                                                    financeData.transactions.forEach(tx => {
                                                        if (tx.status === 'Pending') {
                                                            const amt = parseFloat(tx.amount);
                                                            if (!isNaN(amt)) total += amt;
                                                        }
                                                    });
                                                    return total;
                                                })()} AED
                                            </h3>
                                        </div>
                                    </div>

                                    <!-- Actions & Table -->
                                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto space-y-4">
                                        <div class="flex justify-between items-center flex-wrap gap-2">
                                            <h4 class="text-sm font-bold text-primary">${t('feeManagement')}</h4>
                                            <button onclick="openAddModal('invoice')" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                                                <i class="fa-solid fa-plus text-secondary"></i>
                                                <span>${t('newInvoiceBtn')}</span>
                                            </button>
                                        </div>
                                        <table class="w-full text-xs text-right min-w-[600px]">
                                            <thead>
                                                <tr class="text-gray-400 border-b border-gray-100">
                                                    <th class="py-2 px-3">${t('invoiceNo')}</th>
                                                    <th class="py-2 px-3">${t('studentName')}</th>
                                                    <th class="py-2 px-3">${t('amountLabel')}</th>
                                                    <th class="py-2 px-3">${t('feeStatus')}</th>
                                                    <th class="py-2 px-3">${t('dateLabel')}</th>
                                                    <th class="py-2 px-3 text-left">${t('actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${financeData.transactions.map((tx, idx) => `
                                                    <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                                        <td class="py-3 px-3 font-bold">${tx.invoice}</td>
                                                        <td class="py-3 px-3 font-semibold text-gray-700">${tx.student}</td>
                                                        <td class="py-3 px-3 font-bold text-primary">${tx.amount}</td>
                                                        <td class="py-3 px-3">
                                                            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                                                ${t(tx.status)}
                                                            </span>
                                                        </td>
                                                        <td class="py-3 px-3 text-gray-400">${tx.date}</td>
                                                        <td class="py-3 px-3 text-left flex justify-end gap-1.5">
                                                            ${tx.status === 'Pending' ? `
                                                                <button onclick="collectStudentFee('${tx.invoice}')" class="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100">
                                                                    ${t('collectFee')}
                                                                </button>
                                                            ` : ''}
                                                            <button onclick="printInvoice('${tx.invoice}')" class="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100">
                                                                ${t('feeSlip')}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : activeFeesSubSection === 'setup' ? `
                                    <!-- Inner Setup Sub-tab -->
                                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto space-y-4">
                                        <h4 class="text-sm font-bold text-primary">${currentLang === 'en' ? 'Fee Structure Setup' : (currentLang === 'ur' ? 'کلاس فیس سٹرکچر سیٹ اپ' : 'إعداد هيكل الرسوم')}</h4>
                                        <table class="w-full text-xs text-right min-w-[500px]">
                                            <thead>
                                                <tr class="text-gray-400 border-b border-gray-100">
                                                    <th class="py-2 px-3">ID</th>
                                                    <th class="py-2 px-3">${currentLang === 'en' ? 'Class/Course Name' : (currentLang === 'ur' ? 'شعبہ / کلاس کا نام' : 'اسم الفصل أو الدورة')}</th>
                                                    <th class="py-2 px-3">${currentLang === 'en' ? 'Monthly Fee' : (currentLang === 'ur' ? 'ماہانہ فیس' : 'الرسوم الشهرية')}</th>
                                                    <th class="py-2 px-3 text-left">${t('actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${academicsData.map(c => `
                                                    <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                                        <td class="py-3 px-3 font-bold">${c.id}</td>
                                                        <td class="py-3 px-3 font-semibold text-gray-700">${c.name}</td>
                                                        <td class="py-3 px-3 font-bold text-primary">${c.feeAmount || 0} AED</td>
                                                        <td class="py-3 px-3 text-left">
                                                            <button onclick="editClassFee('${c.id}')" class="bg-secondary text-primary text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-yellow-500">
                                                                ${currentLang === 'en' ? 'Edit Fee' : (currentLang === 'ur' ? 'تبدیل کریں' : 'تعديل')}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : `
                                    <!-- Inner Generate Invoices Sub-tab -->
                                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto space-y-6">
                                        <div class="text-center space-y-2">
                                            <i class="fa-solid fa-wand-magic-sparkles text-4xl text-secondary"></i>
                                            <h4 class="text-base font-bold text-primary">${currentLang === 'en' ? 'Generate Monthly Invoices' : (currentLang === 'ur' ? 'پورے کلاس کی ماہانہ فیس جنریٹ کریں' : 'توليد الفواتير الشهرية للفصول')}</h4>
                                            <p class="text-xs text-gray-500">${currentLang === 'en' ? 'Select a month and class to generate pending invoices for all students in that class' : (currentLang === 'ur' ? 'مہینہ اور کلاس منتخب کریں، اس کلاس کے تمام طلبہ کی فیس کی زیر التواء رسیدیں خودکار جنریٹ ہو جائیں گی' : 'حدد الشهر والفصل لتوليد الفواتير لجميع الطلاب تلقائياً قيد الانتظار')}</p>
                                        </div>

                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-xs font-bold text-gray-500 mb-1">${currentLang === 'en' ? 'Billing Month' : (currentLang === 'ur' ? 'بلنگ کا مہینہ' : 'شهر الفاتورة')}</label>
                                                <select id="gen-fee-month" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                                    <option value="2026/06/01">June 2026</option>
                                                    <option value="2026/07/01">July 2026</option>
                                                    <option value="2026/08/01">August 2026</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-bold text-gray-500 mb-1">${currentLang === 'en' ? 'Select Class' : (currentLang === 'ur' ? 'کلاس منتخب کریں' : 'اختر الحلقة / الفصل')}</label>
                                                <select id="gen-fee-class" class="w-full border p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-primary">
                                                    <option value="all">${currentLang === 'en' ? 'All Classes' : (currentLang === 'ur' ? 'تمام کلاسز' : 'جميع الفصول')}</option>
                                                    ${academicsData.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                                                </select>
                                            </div>
                                            <button onclick="generateMonthlyClassInvoices()" class="w-full bg-primary hover:bg-green-800 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2">
                                                <i class="fa-solid fa-play"></i>
                                                <span>${currentLang === 'en' ? 'Run Auto-Generation' : (currentLang === 'ur' ? 'خودکار فیس جنریٹ کریں' : 'تشغيل التوليد التلقائي')}</span>
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        ` : `
                            <!-- Tab: Audit Report -->
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                                <i class="fa-solid fa-file-shield text-5xl text-secondary"></i>
                                <h3 class="text-base font-bold text-primary">${t('auditTitle')}</h3>
                                <p class="text-xs text-gray-500 max-w-md mx-auto">${t('auditDesc')}</p>
                                <button onclick="alert('Download PDF Audit Report Started')" class="bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-lg">${t('exportPdf')}</button>
                            </div>
                        `}
                    </div>
                `;
            } else if (activeTab === 'academics') {
                html = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                <i class="fa-solid fa-book-quran text-secondary"></i>
                                <span>${t('academicCourses')}</span>
                            </h2>
                            <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Manage study circles, classes and generated study schedules' : (currentLang === 'ur' ? 'تعلیمی شعبہ جات، کلاسز اور اوقات کار کا انتظام' : 'إدارة الحلقات الدراسية وجدول الحصص والخطط')}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="generateAiTimetable()" class="bg-secondary text-primary hover:bg-yellow-500 transition-all font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                <span>${currentDict.timetableOpt}</span>
                            </button>
                            <button onclick="openAddModal('course')" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                                <i class="fa-solid fa-plus text-secondary"></i>
                                <span>${t('addCourse')}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Timetable Loading state demo -->
                    <div id="timetable-generating-state" class="hidden bg-green-50 p-6 rounded-2xl text-center space-y-3 border border-green-200 animate-pulse my-4">
                        <i class="fa-solid fa-cog fa-spin text-3xl text-secondary"></i>
                        <h4 class="font-bold text-primary text-sm">${currentLang === 'en' ? 'AI Smart Timetable Generating...' : (currentLang === 'ur' ? 'اے آئی اسمارٹ ٹائم ٹیبل تیار کیا جا رہا ہے...' : 'جاري توليد جدول الحصص الذكي عبر الذكاء الاصطناعي...')}</h4>
                        <p class="text-xs text-gray-500">Creating optimized schedules with conflict-free slot allocations using Groq AI.</p>
                    </div>

                    <!-- Academics classes grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                        ${academicsData.map(c => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
                                <div class="space-y-2">
                                    <span class="text-xs bg-green-50 text-primary px-2.5 py-1 rounded-full font-bold">${c.id}</span>
                                    <h3 class="font-bold text-primary text-lg mt-1">${t(c.name)}</h3>
                                    <p class="text-xs text-gray-500"><i class="fa-solid fa-user-tie text-secondary ml-1"></i> ${t(c.teacher)}</p>
                                    <p class="text-xs text-gray-500"><i class="fa-solid fa-clock text-secondary ml-1"></i> ${c.timing}</p>
                                </div>
                                <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-semibold">
                                    <span class="text-gray-500">${c.studentsCount} ${currentLang === 'en' ? 'Students' : (currentLang === 'ur' ? 'طلبہ' : 'طلاب')}</span>
                                    <span class="text-secondary hover:underline cursor-pointer">${currentLang === 'en' ? 'View Details' : (currentLang === 'ur' ? 'تفصیلات دیکھیں' : 'عرض التفاصيل')} &larr;</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (activeTab === 'rewards') {
                html = `
                    <div class="flex justify-between items-center border-b border-gray-200 pb-4">
                        <div>
                            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                <i class="fa-solid fa-award text-secondary"></i>
                                <span>${t('rewardsPortal')}</span>
                            </h2>
                            <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Encourage academic excellence through motivational badges' : (currentLang === 'ur' ? 'طلبہ کی حوصلہ افزائی کے لیے تعلیمی بیجز اور اعزازات' : 'تحفيز الطلاب وتكريمهم بالشارات والأوسمة المتميزة')}</p>
                        </div>
                        <button onclick="openAddModal('reward')" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                            <i class="fa-solid fa-plus text-secondary"></i>
                            <span>${t('awardBadge')}</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                        ${rewardsData.map(r => `
                            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all">
                                <div class="flex items-center gap-3">
                                    <div class="p-3 rounded-full bg-${r.color}-50 text-${r.color}-600">
                                        <i class="fa-solid fa-trophy text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-primary text-base">${t(r.badge)}</h3>
                                        <p class="text-xs text-gray-400 font-bold">${r.studentName}</p>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-600 leading-relaxed">${t(r.reason)}</p>
                                <div class="text-[10px] text-gray-400 font-bold text-left pt-2 border-t border-gray-50">
                                    ${r.date}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (activeTab === 'communication') {
                html = `
                    <div class="border-b border-gray-200 pb-4">
                        <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                            <i class="fa-solid fa-comments text-secondary"></i>
                            <span>${currentLang === 'en' ? 'Communication Hub' : (currentLang === 'ur' ? 'غرفة التواصل (چیٹ سینٹر)' : 'غرفة التواصل المباشر')}</span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Direct messages between admin, teachers, and parents' : (currentLang === 'ur' ? 'اساتذہ، والدین اور ایڈمنسٹریشن کے درمیان براہ راست پیغام رسانی' : 'قنوات الاتصال المباشر بين الإدارة والمعلمين وأولياء الأمور')}</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] my-4">
                        <!-- Sidebar channels list -->
                        <div class="border-l border-gray-100 p-4 space-y-3 bg-gray-50/50">
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">${currentLang === 'en' ? 'Channels' : (currentLang === 'ur' ? 'پیغام رسانی چینلز' : 'القنوات العامة')}</h4>
                            <div class="space-y-1">
                                <button class="w-full text-right flex items-center gap-3 p-2.5 rounded-lg bg-green-50 text-primary font-bold text-xs">
                                    <i class="fa-solid fa-bullhorn text-secondary"></i>
                                    <span>${t('announcements')}</span>
                                </button>
                                <button class="w-full text-right flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 text-gray-600 text-xs">
                                    <i class="fa-solid fa-chalkboard-user"></i>
                                    <span>${t('teachersLounge')}</span>
                                </button>
                                <button class="w-full text-right flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 text-gray-600 text-xs">
                                    <i class="fa-solid fa-hands-holding"></i>
                                    <span>${t('parentTeacherLink')}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Chat Feed Panel -->
                        <div class="lg:col-span-3 flex flex-col justify-between">
                            <!-- Messages Area -->
                            <div class="p-6 space-y-4 overflow-y-auto h-[350px]" id="chat-messages-container">
                                ${communicationData.chats.map(c => `
                                    <div class="flex flex-col ${c.type === 'admin' ? 'items-start' : 'items-end'}">
                                        <div class="flex items-center gap-1.5 mb-1 flex-row-reverse">
                                            <span class="text-[10px] text-gray-400 font-bold">${c.time}</span>
                                            <span class="text-xs font-bold text-primary">${t(c.sender)}</span>
                                        </div>
                                        <div class="p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${c.type === 'admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-darkNeutral rounded-tl-none'}">
                                            ${t(c.message)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Input Box -->
                            <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2">
                                <input type="text" id="chat-input" placeholder="${t('chatPlaceholder')}" class="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-secondary bg-white">
                                <button onclick="sendChatMessage()" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2">
                                    <span>${currentLang === 'en' ? 'Send' : 'ارسال'}</span>
                                    <i class="fa-solid fa-paper-plane text-secondary"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (activeTab === 'gallery') {
                // Count Stats
                const totalMedia = galleryData.length;
                const imagesCount = galleryData.filter(g => g.type === 'image').length;
                const videosCount = galleryData.filter(g => g.type === 'video').length;
                const audioCount = galleryData.filter(g => g.type === 'audio').length;

                // Filtered List
                const filteredGallery = galleryData.filter(g => {
                    const matchesCategory = currentGalleryCategory === 'all' || g.category === currentGalleryCategory;
                    const matchesSearch = g.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) || 
                                          g.desc.toLowerCase().includes(gallerySearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                });

                html = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
                                <i class="fa-solid fa-images text-secondary"></i>
                                <span>${currentLang === 'en' ? 'Media Gallery & Achievements' : (currentLang === 'ur' ? 'تصاویر و ویڈیوز گیلری' : 'معرض الصور والنشاطات')}</span>
                            </h2>
                            <p class="text-xs text-gray-500 mt-1">${currentLang === 'en' ? 'Achievements, events and academic memories' : (currentLang === 'ur' ? 'جامعہ الفرقان کی سرگرمیاں، تقریبات اور یادیں' : 'نشاطات جامعة الفرقان وفعالياتها وإنجازاتها')}</p>
                        </div>
                        <button onclick="openAddModal('gallery')" class="bg-primary hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 min-h-[44px]">
                            <i class="fa-solid fa-plus text-secondary"></i>
                            <span>${currentLang === 'en' ? 'Upload Media' : (currentLang === 'ur' ? 'نیا میڈیا اپلوڈ کریں' : 'إضافة نشاط / رفع')}</span>
                        </button>
                    </div>

                    <!-- Gallery Stats Summary Cards -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${currentLang === 'en' ? 'Total Media' : (currentLang === 'ur' ? 'کل میڈیا' : 'إجمالي الوسائط')}</p>
                                <h3 class="text-xl font-bold text-primary mt-0.5">${totalMedia}</h3>
                            </div>
                            <i class="fa-solid fa-photo-film text-secondary text-lg"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${currentLang === 'en' ? 'Images' : (currentLang === 'ur' ? 'تصاویر' : 'الصور')}</p>
                                <h3 class="text-xl font-bold text-primary mt-0.5">${imagesCount}</h3>
                            </div>
                            <i class="fa-solid fa-image text-emerald-500 text-lg"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${currentLang === 'en' ? 'Videos' : (currentLang === 'ur' ? 'ویڈیوز' : 'الفيديوهات')}</p>
                                <h3 class="text-xl font-bold text-primary mt-0.5">${videosCount}</h3>
                            </div>
                            <i class="fa-solid fa-video text-amber-500 text-lg"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${t('audioLabel')}</p>
                                <h3 class="text-xl font-bold text-primary mt-0.5">${audioCount}</h3>
                            </div>
                            <i class="fa-solid fa-volume-high text-blue-500 text-lg"></i>
                        </div>
                    </div>

                    <!-- Category Filters & Layout Toggles & Search -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 my-4">
                        <!-- Filters -->
                        <div class="flex flex-wrap gap-1.5">
                            <button onclick="filterGalleryCategory('all')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('allLabel')}</button>
                            <button onclick="filterGalleryCategory('dars')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'dars' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('darsLabel')}</button>
                            <button onclick="filterGalleryCategory('hifz')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'hifz' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('hifzLabel')}</button>
                            <button onclick="filterGalleryCategory('sports')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'sports' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('sportsLabel')}</button>
                            <button onclick="filterGalleryCategory('events')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'events' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('eventsLabel')}</button>
                            <button onclick="filterGalleryCategory('service')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'service' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${t('socialServiceLabel')}</button>
                            <button onclick="filterGalleryCategory('audio')" class="px-3 py-1.5 rounded-full text-xs font-semibold ${currentGalleryCategory === 'audio' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${currentLang === 'en' ? 'Audios' : (currentLang === 'ur' ? 'آڈیو تلاوت' : 'التلاوات الصوتية')}</button>
                        </div>
                        
                        <!-- Search and Layout Toggles -->
                        <div class="flex items-center gap-2">
                            <input type="text" id="gallery-search-box" value="${gallerySearchQuery}" oninput="searchGallery(this.value)" placeholder="${t('searchGalleryPlaceholder')}" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary w-48">
                            
                            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button onclick="toggleGalleryLayout('grid')" class="p-2 text-xs ${currentGalleryLayout === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}" title="Grid View">
                                    <i class="fa-solid fa-grip"></i>
                                </button>
                                <button onclick="toggleGalleryLayout('list')" class="p-2 text-xs ${currentGalleryLayout === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}" title="List View">
                                    <i class="fa-solid fa-list"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery Grid / List view rendering -->
                    ${currentGalleryLayout === 'grid' ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
                            ${filteredGallery.map(g => `
                                <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex flex-col justify-between group">
                                    <!-- Visual Content -->
                                    <div class="relative overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                                        ${g.type === 'audio' ? `
                                            <div class="p-6 text-center w-full">
                                                <span class="text-5xl block mb-2">📖</span>
                                                <audio controls class="w-full mt-2">
                                                    <source src="${g.src}" type="audio/mpeg">
                                                </audio>
                                            </div>
                                        ` : `
                                            <img src="${g.src}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                            <span class="absolute top-3 right-3 text-[10px] bg-black/60 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                                                <i class="fa-solid ${g.type === 'video' ? 'fa-video text-amber-400' : 'fa-image text-emerald-400'}"></i>
                                                <span>${g.type === 'video' ? t('videoLabel') : t('photoLabel')}</span>
                                            </span>
                                            ${g.type === 'video' ? `
                                                <div class="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer">
                                                    <div class="bg-white/90 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                        <i class="fa-solid fa-play text-lg translate-x-[2px]"></i>
                                                    </div>
                                                </div>
                                            ` : ''}
                                        `}
                                    </div>
                                    
                                    <!-- Info Area -->
                                    <div class="p-4 space-y-2 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div class="flex items-center justify-between gap-2">
                                                <span class="text-[10px] bg-green-50 text-primary px-2.5 py-0.5 rounded font-bold uppercase">${g.category}</span>
                                                <span class="text-[10px] text-gray-400 font-semibold">${g.date}</span>
                                            </div>
                                            <h4 class="font-bold text-primary text-sm mt-1 leading-snug">${t(g.title)}</h4>
                                            <p class="text-xs text-gray-500 line-clamp-2 mt-1">${t(g.desc)}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <!-- List View -->
                        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden my-4">
                            <table class="w-full text-sm text-right">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-100 bg-gray-50/50">
                                        <th class="py-3 px-4">${t('titleDescLabel')}</th>
                                        <th class="py-3 px-4">${t('categoryLabel')}</th>
                                        <th class="py-3 px-4">${t('typeLabel')}</th>
                                        <th class="py-3 px-4 text-left">${t('dateLabel')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${filteredGallery.map(g => `
                                        <tr class="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td class="py-3 px-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-12 h-12 rounded bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                                                        ${g.type === 'audio' ? '📖' : `<img src="${g.src}" class="w-full h-full object-cover">`}
                                                    </div>
                                                    <div>
                                                        <h5 class="font-bold text-primary text-xs">${t(g.title)}</h5>
                                                        <p class="text-[11px] text-gray-400 mt-0.5">${t(g.desc)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-3 px-4"><span class="bg-green-50 text-primary text-xs px-2 py-0.5 rounded font-bold uppercase">${g.category}</span></td>
                                            <td class="py-3 px-4 text-gray-500 text-xs">${g.type}</td>
                                            <td class="py-3 px-4 text-gray-400 text-xs text-left">${g.date}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                `;
            } else {
                html = `
                    <div class="p-6 text-center text-gray-400">
                        Under construction...
                    </div>
                `;
            }

            container.innerHTML = html;
        }

        // Dedicated User Portal Renders
        function renderTeacherView(container, dict) {
            container.innerHTML = `
                <div class="border-b border-gray-200 pb-4">
                    <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
                        <i class="fa-solid fa-clipboard-user text-secondary"></i>
                        <span>${t('attendanceAcademicGrid')}</span>
                    </h2>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table class="w-full text-sm text-right min-w-[600px]">
                        <thead>
                            <tr class="text-gray-400 border-b border-gray-100">
                                <th class="py-3 px-2">${t('student')}</th>
                                <th class="py-3 px-2">${t('attendanceStatus')}</th>
                                <th class="py-3 px-2">${t('todaysLesson')}</th>
                                <th class="py-3 px-2">${t('previousLesson')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-50">
                                <td class="py-3 px-2 font-medium">عبدالرحمن بن سليم</td>
                                <td class="py-3 px-2"><span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">${currentLang === 'en' ? 'Present' : (currentLang === 'ur' ? 'حاضر' : 'حاضر')}</span></td>
                                <td class="py-3 px-2">${t('presentJuzRuku')}</td>
                                <td class="py-3 px-2">${t('ruku')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        function renderStudentView(container, dict) {
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                        <div class="relative w-24 h-24 mx-auto">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" class="w-full h-full rounded-full object-cover border-2 border-secondary">
                        </div>
                        <h3 class="text-lg font-bold text-primary">عبدالرحمن بن سليم</h3>
                    </div>
                </div>
            `;
        }

        function renderParentView(container, dict) {
            const currentChild = childrenData[currentChildIndex];
            container.innerHTML = `
                <div class="bg-primary text-white p-6 rounded-2xl shadow-md space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-secondary">${t('childrenProfilesCarousel')}</h3>
                        <div class="flex gap-2">
                            ${childrenData.map((childItem, idx) => `
                                <button onclick="switchChild(${idx})" class="${currentChildIndex === idx ? 'bg-secondary text-primary' : 'bg-green-800 text-white'} px-4 py-2 rounded-lg text-xs font-bold transition-all">
                                    ${idx === 0 ? (currentLang === 'en' ? 'Abdur Rahman' : (currentLang === 'ur' ? 'عبدالرحمن' : 'عبد الرحمن')) : (currentLang === 'en' ? 'Fatima' : (currentLang === 'ur' ? 'فاطمہ' : 'فاطمة'))}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 space-y-2">
                        <h4 class="font-bold text-primary">${t('academicPerformance')}</h4>
                        <p id="child-name-display" class="font-bold">${currentChild.name}</p>
                        <p id="child-grade-display">${t(currentChild.grade)}</p>
                        <p id="child-sabaq-display">${t(currentChild.sabaq)}</p>
                    </div>
                </div>
            `;
        }

        // Modal Action Handlers
        function openAddModal(type) {
            modalContext = type;
            const modal = document.getElementById('data-modal');
            const title = document.getElementById('modal-title');
            const fields = document.getElementById('modal-form-fields');
            
            modal.classList.remove('hidden');

            if (type === 'student') {
                title.innerText = currentLang === 'en' ? 'Add New Student' : 'نیا طالب علم شامل کریں';
                fields.innerHTML = `
                    <input type="text" id="in-stu-name" placeholder="طالب علم کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-stu-parent" placeholder="والد کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-stu-grade" placeholder="کلاس / شعبہ" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-stu-blood" placeholder="بلڈ گروپ (Blood Type)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                `;
            } else if (type === 'teacher') {
                title.innerText = currentLang === 'en' ? 'Add New Teacher' : 'نیا استاد شامل کریں';
                fields.innerHTML = `
                    <input type="text" id="in-teach-name" placeholder="استاد کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-teach-spec" placeholder="شعبہ / کورس (Specialization)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-teach-sal" placeholder="ماہانہ تنخواہ" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                `;
            } else if (type === 'staff') {
                title.innerText = currentLang === 'en' ? 'Add Staff Member' : 'نیا اسٹاف ممبر شامل کریں';
                fields.innerHTML = `
                    <input type="text" id="in-staff-name" placeholder="نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-staff-role" placeholder="عہدہ / کام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-staff-salary" placeholder="ماہانہ تنخواہ (Salary)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                `;
            } else if (type === 'donation') {
                title.innerText = currentLang === 'en' ? 'Record Donation' : 'عطیہ کا اندراج کریں';
                fields.innerHTML = `
                    <input type="text" id="in-don-name" placeholder="عطیہ دہندہ کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-don-amount" placeholder="عطیہ کی رقم" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-don-type" placeholder="قسم (زکوٰۃ / صدقہ / عطیہ)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                `;
            } else if (type === 'invoice') {
                title.innerText = currentLang === 'en' ? 'Create New Invoice' : (currentLang === 'ur' ? 'نیا چالان بنائیں' : 'إنشاء فاتورة جديدة');
                const optionsHtml = studentsData.map(s => `<option value="${s.name} (${s.id})">${s.id} - ${s.name}</option>`).join('');
                fields.innerHTML = `
                    <input list="invoice-students-dl" id="in-inv-student" placeholder="${currentLang === 'en' ? 'Student Name or ID' : (currentLang === 'ur' ? 'طالب علم کا نام یا آئی ڈی' : 'اسم الطالب أو الرقم المعرف')}" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <datalist id="invoice-students-dl">
                        ${optionsHtml}
                    </datalist>
                    <input type="text" id="in-inv-amount" placeholder="فیس کی رقم (مثال: 500 AED)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <select id="in-inv-status" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                `;
            } else if (type === 'course') {
                title.innerText = currentLang === 'en' ? 'Add New Course / Class' : (currentLang === 'ur' ? 'نیا تعلیمی شعبہ / کلاس درج کریں' : 'إضافة حلقة / مقرر جديد');
                fields.innerHTML = `
                    <input type="text" id="in-course-name" placeholder="کورس / کلاس کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-course-teacher" placeholder="مدرس / معلم کا نام" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <input type="text" id="in-course-timing" placeholder="کلاس کے اوقات (مثال: 08:00 AM - 12:00 PM)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                `;
            } else if (type === 'reward') {
                title.innerText = currentLang === 'en' ? 'Award New Badge' : (currentLang === 'ur' ? 'نیا تعلیمی بیج جاری کریں' : 'منح شارة جديدة للطالب');
                const optionsHtml = studentsData.map(s => `<option value="${s.name} (${s.id})">${s.id} - ${s.name}</option>`).join('');
                fields.innerHTML = `
                    <input list="reward-students-dl" id="in-reward-student" placeholder="${currentLang === 'en' ? 'Student Name or ID' : (currentLang === 'ur' ? 'طالب علم کا نام یا آئی ڈی' : 'اسم الطالب أو الرقم المعرف')}" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <datalist id="reward-students-dl">
                        ${optionsHtml}
                    </datalist>
                    <input type="text" id="in-reward-badge" placeholder="بیج کا نام (مثال: Hifz Star)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <select id="in-reward-color" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                        <option value="amber">Gold / Amber</option>
                        <option value="emerald">Green / Emerald</option>
                        <option value="blue">Blue</option>
                    </select>
                    <textarea id="in-reward-reason" placeholder="وجہ / کارکردگی کی تفصیل" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary" rows="2"></textarea>
                `;
            } else if (type === 'gallery') {
                title.innerText = currentLang === 'en' ? 'Upload Gallery Media' : (currentLang === 'ur' ? 'نیا گیلری میڈیا شامل کریں' : 'إضافة وسائط للمعرض');
                fields.innerHTML = `
                    <input type="text" id="in-gal-title" placeholder="عنوان (Title)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <select id="in-gal-type" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                        <option value="image">Photo / تصویر</option>
                        <option value="video">Video / ویڈیو</option>
                        <option value="audio">Audio / تلاوت</option>
                    </select>
                    <select id="in-gal-category" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                        <option value="dars">درس نظامی</option>
                        <option value="hifz">حفظ</option>
                        <option value="sports">کھیل</option>
                        <option value="events">تقریبات</option>
                        <option value="service">خدمتِ خلق</option>
                        <option value="audio">آڈیو تلاوت</option>
                    </select>
                    <input type="text" id="in-gal-src" placeholder="تصویر/میڈیا لنک (Image/Media URL)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary">
                    <textarea id="in-gal-desc" placeholder="تفصیل (Description)" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-secondary" rows="2"></textarea>
                `;
            }
        }

        function closeModal() {
            document.getElementById('data-modal').classList.add('hidden');
        }

        function submitModalForm() {
            if (modalContext === 'student') {
                const name = document.getElementById('in-stu-name').value;
                const parent = document.getElementById('in-stu-parent').value;
                const grade = document.getElementById('in-stu-grade').value;
                const blood = document.getElementById('in-stu-blood').value;
                if (name) {
                    studentsData.push({
                        id: `STU-${Math.floor(100 + Math.random() * 900)}`,
                        name: name,
                        parent: parent || '---',
                        grade: grade || 'General',
                        blood: blood || '---',
                        phone: '+9230000000'
                    });
                }
            } else if (modalContext === 'teacher') {
                const name = document.getElementById('in-teach-name').value;
                const spec = document.getElementById('in-teach-spec').value;
                const sal = document.getElementById('in-teach-sal').value;
                if (name) {
                    teachersData.push({
                        id: `TCH-${Math.floor(100 + Math.random() * 900)}`,
                        name: name,
                        specialization: spec || 'General',
                        salary: sal || '0 AED',
                        status: 'Paid'
                    });
                }
            } else if (modalContext === 'staff') {
                const name = document.getElementById('in-staff-name').value;
                const role = document.getElementById('in-staff-role').value;
                const salary = document.getElementById('in-staff-salary').value;
                if (name) {
                    staffData.push({
                        id: `STF-${Math.floor(100 + Math.random() * 900)}`,
                        name: name,
                        duty: role || 'Staff',
                        salary: salary || '0 AED',
                        status: 'Paid'
                    });
                }
            } else if (modalContext === 'donation') {
                const donor = document.getElementById('in-don-name').value;
                const amount = document.getElementById('in-don-amount').value;
                const type = document.getElementById('in-don-type').value;
                if (donor) {
                    donationsData.push({
                        donor: donor,
                        amount: amount || '0 AED',
                        type: type || 'General',
                        date: '2026/06/14'
                    });
                }
            } else if (modalContext === 'invoice') {
                const student = document.getElementById('in-inv-student').value;
                const amount = document.getElementById('in-inv-amount').value;
                const status = document.getElementById('in-inv-status').value;
                if (student) {
                    financeData.transactions.push({
                        invoice: `INV-${Math.floor(100 + Math.random() * 900)}`,
                        student: student,
                        amount: amount || '0 AED',
                        status: status,
                        date: '2026/06/14'
                    });
                }
            } else if (modalContext === 'course') {
                const name = document.getElementById('in-course-name').value;
                const teacher = document.getElementById('in-course-teacher').value;
                const timing = document.getElementById('in-course-timing').value;
                if (name) {
                    academicsData.push({
                        id: `ACAD-${Math.floor(100 + Math.random() * 900)}`,
                        name: name,
                        teacher: teacher || 'General Teacher',
                        timing: timing || '08:00 AM - 12:00 PM',
                        studentsCount: 0
                    });
                }
            } else if (modalContext === 'reward') {
                const student = document.getElementById('in-reward-student').value;
                const badge = document.getElementById('in-reward-badge').value;
                const color = document.getElementById('in-reward-color').value;
                const reason = document.getElementById('in-reward-reason').value;
                if (student) {
                    rewardsData.push({
                        studentName: student,
                        badge: badge || 'New Recognition',
                        color: color || 'amber',
                        reason: reason || 'Excellent achievement.',
                        date: '2026/06/14'
                    });
                }
            } else if (modalContext === 'gallery') {
                const title = document.getElementById('in-gal-title').value;
                const type = document.getElementById('in-gal-type').value;
                const category = document.getElementById('in-gal-category').value;
                const src = document.getElementById('in-gal-src').value || "https://images.unsplash.com/photo-1584281729155-3c1b3c824968?auto=format&fit=crop&q=80&w=400";
                const desc = document.getElementById('in-gal-desc').value;
                if (title) {
                    galleryData.push({
                        id: `GAL-${Math.floor(100 + Math.random() * 900)}`,
                        title: title,
                        type: type,
                        category: category,
                        src: src,
                        desc: desc || '---',
                        date: '2026/06/14'
                    });
                }
            }
            closeModal();
            renderTabContent();
        }

        // Attendance Actions
        function updateAttendanceStatus(index, status) {
            attendanceData[index].status = status;
        }

        function updateAttendanceSabaq(index, sabaq) {
            attendanceData[index].sabaq = sabaq;
        }

        function saveAttendance() {
            alert(currentLang === 'en' ? 'Attendance sheet saved successfully!' : (currentLang === 'ur' ? 'حاضری شیٹ کامیابی سے محفوظ ہو گئی ہے!' : 'تم حفظ سجل الحضور بنجاح!'));
        }

        // Timetable Generation
        function generateAiTimetable() {
            const loader = document.getElementById('timetable-generating-state');
            if (loader) {
                loader.classList.remove('hidden');
                setTimeout(() => {
                    loader.classList.add('hidden');
                    alert(currentLang === 'en' ? 'AI Timetable generated successfully!' : (currentLang === 'ur' ? 'اے آئی ٹائم ٹیبل کامیابی سے تیار کر لیا گیا ہے!' : 'تم توليد جدول الحصص بنجاح!'));
                }, 2000);
            }
        }

        // Message board handler
        function sendChatMessage() {
            const input = document.getElementById('chat-input');
            if (input && input.value.trim() !== '') {
                communicationData.chats.push({
                    sender: currentLang === 'en' ? 'Me' : (currentLang === 'ur' ? 'میں' : 'أنا'),
                    message: input.value,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'admin'
                });
                input.value = '';
                renderTabContent();
                setTimeout(() => {
                    const chatBox = document.getElementById('chat-messages-container');
                    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
                }, 10);
            }
        }

        // Gallery Actions
        function filterGalleryCategory(category) {
            currentGalleryCategory = category;
            renderTabContent();
        }

        function toggleGalleryLayout(layout) {
            currentGalleryLayout = layout;
            renderTabContent();
        }

        function searchGallery(query) {
            gallerySearchQuery = query;
            renderTabContent();
        }

        let activeSalaryItem = null;

        function saveFinanceEntry() {
            const type = document.getElementById('fin-entry-type').value;
            const head = document.getElementById('fin-entry-head').value;
            const name = document.getElementById('fin-entry-name').value;
            const amountVal = document.getElementById('fin-entry-amount').value;
            const date = document.getElementById('fin-entry-date').value;
            const desc = document.getElementById('fin-entry-desc').value;

            if (!name || !amountVal) {
                alert("براہ کرم نام اور رقم درج کریں!");
                return;
            }

            const amount = parseFloat(amountVal);
            if (isNaN(amount) || amount <= 0) {
                alert("براہ کرم درست رقم درج کریں!");
                return;
            }

            // Create new record ID
            const newId = financeTransactions.length > 0 ? Math.max(...financeTransactions.map(t => t.id)) + 1 : 1;

            // Push to dataset
            financeTransactions.push({
                id: newId,
                date: date || '2026-06-14',
                head: head,
                name: name + (desc ? ` — ${desc}` : ''),
                type: type,
                amount: amount
            });

            alert("اندراج کامیابی سے محفوظ ہو گیا!");
            
            // Switch to ledger view to show it
            activeFinanceSubTab = 'daybook';
            renderTabContent();
        }

        function deleteFinanceEntry(id) {
            if (confirm("کیا آپ واقعی یہ کھاتہ اندراج حذف کرنا چاہتے ہیں؟")) {
                const idx = financeTransactions.findIndex(t => t.id === id);
                if (idx !== -1) {
                    financeTransactions.splice(idx, 1);
                    renderTabContent();
                }
            }
        }

        function collectStudentFee(invoice) {
            const tx = financeData.transactions.find(t => t.invoice === invoice);
            if (tx) {
                tx.status = 'Paid';
                const amtNumeric = parseFloat(tx.amount) || 0;
                const newId = financeTransactions.length > 0 ? Math.max(...financeTransactions.map(t => t.id)) + 1 : 1;
                
                // Add to Daybook Ledger
                financeTransactions.push({
                    id: newId,
                    date: tx.date.replace(/\//g, '-'),
                    head: "فیس (خودکار)",
                    name: `${tx.student} — ${t('feeSlip')} ${tx.invoice}`,
                    type: "آمدن",
                    amount: amtNumeric
                });
                alert(t('invoiceCreated') || "Fee collected successfully!");
                renderTabContent();
            }
        }

        function printInvoice(invoice) {
            const tx = financeData.transactions.find(t => t.invoice === invoice);
            if (tx) {
                alert(`${t('feeSlip')}: ${tx.invoice}\n${t('studentName')}: ${tx.student}\n${t('amountLabel')}: ${tx.amount}\n${t('feeStatus')}: ${t(tx.status)}\n${t('dateLabel')}: ${tx.date}`);
            }
        }

        function editClassFee(courseId) {
            const course = academicsData.find(c => c.id === courseId);
            if (course) {
                const promptMsg = currentLang === 'en' ? `Enter monthly fee amount for ${course.name}:` : 
                                  (currentLang === 'ur' ? `${course.name} کے لیے ماہانہ فیس درج کریں:` : `أدخل قيمة الرسوم الشهرية لـ ${course.name}:`);
                const newFeeInput = prompt(promptMsg, course.feeAmount || 0);
                if (newFeeInput !== null) {
                    const newFee = parseFloat(newFeeInput);
                    if (!isNaN(newFee) && newFee >= 0) {
                        course.feeAmount = newFee;
                        alert(currentLang === 'en' ? "Fee updated successfully!" : (currentLang === 'ur' ? "فیس تبدیل ہو گئی ہے!" : "تم تحديث الرسوم بنجاح!"));
                        renderTabContent();
                    } else {
                        alert(currentLang === 'en' ? "Please enter a valid amount!" : (currentLang === 'ur' ? "براہ کرم درست رقم درج کریں!" : "الرجاء إدخال مبلغ صحيح!"));
                    }
                }
            }
        }

        function getStudentClassFee(grade) {
            const gradeLower = String(grade).toLowerCase();
            if (gradeLower.includes('hifz')) {
                return academicsData.find(c => c.name.includes('Hifz'))?.feeAmount || 500;
            }
            if (gradeLower.includes('tajweed') || gradeLower.includes('qaida')) {
                return academicsData.find(c => c.name.includes('Tajweed'))?.feeAmount || 200;
            }
            if (gradeLower.includes('dars') || gradeLower.includes('nizami')) {
                return academicsData.find(c => c.name.includes('Dars-e-Nizami'))?.feeAmount || 800;
            }
            if (gradeLower.includes('arabic') || gradeLower.includes('literature')) {
                return academicsData.find(c => c.name.includes('Arabic'))?.feeAmount || 400;
            }
            return 300; // default fallback fee
        }

        function generateMonthlyClassInvoices() {
            const selectedMonthVal = document.getElementById('gen-fee-month').value;
            const selectedClass = document.getElementById('gen-fee-class').value;
            
            // Format billing date
            const billingDate = new Date(selectedMonthVal);
            const formattedDateStr = billingDate.toLocaleDateString('zh-Hans-CN'); // YYYY/MM/DD
            
            // For checking duplicate invoices in the same month (approx check by year/month)
            const yearMonthPrefix = selectedMonthVal.substring(0, 7); // e.g. "2026/06"
            
            let count = 0;
            
            studentsData.forEach(student => {
                const studentGrade = student.grade;
                const matchesClass = selectedClass === 'all' || 
                                     (selectedClass.includes('Hifz') && studentGrade.toLowerCase().includes('hifz')) ||
                                     (selectedClass.includes('Tajweed') && (studentGrade.toLowerCase().includes('tajweed') || studentGrade.toLowerCase().includes('qaida'))) ||
                                     (selectedClass.includes('Dars-e-Nizami') && studentGrade.toLowerCase().includes('dars-e-nizami')) ||
                                     (selectedClass.includes('Arabic') && studentGrade.toLowerCase().includes('arabic'));

                if (matchesClass) {
                    // Check duplicate invoice
                    const hasDuplicate = financeData.transactions.some(tx => 
                        tx.student.includes(student.name) && 
                        tx.date.replace(/-/g, '/').startsWith(yearMonthPrefix.replace(/-/g, '/'))
                    );
                    
                    if (!hasDuplicate) {
                        const classFee = getStudentClassFee(studentGrade);
                        financeData.transactions.push({
                            invoice: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                            student: student.name,
                            amount: `${classFee} AED`,
                            status: "Pending",
                            date: formattedDateStr
                        });
                        count++;
                    }
                }
            });
            
            const successMsg = currentLang === 'en' ? `Successfully generated ${count} pending invoices!` : 
                               (currentLang === 'ur' ? `کامیابی سے ${count} زیر التواء فیس چالان جنریٹ ہو گئے ہیں!` : `تم إنشاء ${count} فاتورة رسوم جديدة بنجاح!`);
            alert(successMsg);
            
            // Switch to Invoices view
            activeFeesSubSection = 'invoices';
            renderTabContent();
        }

        function switchDirectorySubTab(dirName, subTabName) {
            activeDirectorySubTabs[dirName] = subTabName;
            renderTabContent();
        }

        function showIdCard(type, index) {
            let item = null;
            let titleText = "";
            let htmlTable = "";
            let cardNum = index + 1;
            
            if (type === 'student') {
                item = studentsData[index];
                titleText = "طالب علم شناختی کارڈ";
                htmlTable = `
                    <tr><td class="font-bold py-1 text-primary">نام:</td><td class="py-1">${item.name}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">والد:</td><td class="py-1">${item.parent || '---'}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">رول نمبر:</td><td class="py-1">${item.id}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">کلاس:</td><td class="py-1">${item.grade}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">رابطہ:</td><td class="py-1">${item.phone || '---'}</td></tr>
                `;
            } else if (type === 'teacher') {
                item = teachersData[index];
                titleText = "استاد سروس کارڈ";
                htmlTable = `
                    <tr><td class="font-bold py-1 text-primary">نام:</td><td class="py-1">${item.name}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">عہدہ:</td><td class="py-1">${item.specialization}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">قابلیت:</td><td class="py-1">درس نظامی (فاضل)</td></tr>
                    <tr><td class="font-bold py-1 text-primary">تنخواہ:</td><td class="py-1">${item.salary}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">تاریخ مقرر:</td><td class="py-1">2025-03-01</td></tr>
                `;
            } else if (type === 'staff') {
                item = staffData[index];
                titleText = "ملازم سروس کارڈ";
                htmlTable = `
                    <tr><td class="font-bold py-1 text-primary">نام:</td><td class="py-1">${item.name}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">عہدہ:</td><td class="py-1">${item.duty}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">تنخواہ:</td><td class="py-1">${item.salary}</td></tr>
                    <tr><td class="font-bold py-1 text-primary">تاریخ مقرر:</td><td class="py-1">2025-03-01</td></tr>
                `;
            }
            
            document.getElementById('card-modal-title').innerText = titleText;
            document.getElementById('card-details-table').innerHTML = `<table class="w-full text-right">${htmlTable}</table>`;
            document.getElementById('card-number-text').innerText = "نمبر: " + cardNum;
            document.getElementById('id-card-modal').classList.remove('hidden');
        }

        function closeCardModal() {
            document.getElementById('id-card-modal').classList.add('hidden');
        }

        function printCard() {
            window.print();
        }

        function deleteDirectoryItem(type, index) {
            if (confirm("کیا آپ واقعی حذف کرنا چاہتے ہیں؟")) {
                if (type === 'student') studentsData.splice(index, 1);
                else if (type === 'teacher') teachersData.splice(index, 1);
                else if (type === 'staff') staffData.splice(index, 1);
                renderTabContent();
            }
        }

        function selectSalaryItem(type, index) {
            activeSalaryItem = type === 'teacher' ? teachersData[index] : staffData[index];
            switchDirectorySubTab(type + 's', 'finance');
        }

        function paySalary() {
            if (activeSalaryItem) {
                const amount = document.getElementById('sal-log-amount').value;
                alert(`تنخواہ کی ادائیگی (${amount}) کامیابی سے درج کر لی گئی ہے!`);
                activeSalaryItem.status = 'Paid';
                renderTabContent();
            }
        }

        function saveStudentEntry() {
            const name = document.getElementById('stu-reg-name').value;
            const parent = document.getElementById('stu-reg-parent').value;
            const grade = document.getElementById('stu-reg-grade').value;
            const blood = document.getElementById('stu-reg-blood').value;
            const phone = document.getElementById('stu-reg-phone').value;
            if (name) {
                studentsData.push({
                    id: `STU-${Math.floor(100 + Math.random() * 900)}`,
                    name: name,
                    parent: parent || '---',
                    grade: grade || 'General',
                    blood: blood || '---',
                    phone: phone || '+9230000000'
                });
                switchDirectorySubTab('students', 'list');
            } else {
                alert("براہ کرم تمام لازمی فیلڈز پُر کریں!");
            }
        }

         function saveTeacherEntry() {
            const name = document.getElementById('teach-reg-name').value;
            const spec = document.getElementById('teach-reg-spec').value;
            const sal = document.getElementById('teach-reg-sal').value;
            if (name) {
                teachersData.push({
                    id: `TCH-${Math.floor(100 + Math.random() * 900)}`,
                    name: name,
                    specialization: spec || 'General',
                    salary: sal || '0 AED',
                    status: 'Paid'
                });
                switchDirectorySubTab('teachers', 'list');
            } else {
                alert("براہ کرم تمام لازمی فیلڈز پُر کریں!");
            }
        }

        function saveStaffEntry() {
            const name = document.getElementById('staff-reg-name').value;
            const role = document.getElementById('staff-reg-role').value;
            const sal = document.getElementById('staff-reg-sal').value;
            if (name) {
                staffData.push({
                    id: `STF-${Math.floor(100 + Math.random() * 900)}`,
                    name: name,
                    duty: role || 'General Staff',
                    salary: sal || '0 AED',
                    status: 'Paid'
                });
                switchDirectorySubTab('staff', 'list');
            } else {
                alert("براہ کرم تمام لازمی فیلڈز پُر کریں!");
            }
        }

        function updateLocalizedUI() {
            const currentDict = translations[currentLang];
            const searchBar = document.getElementById('search-input');
            if (searchBar) searchBar.placeholder = currentDict.searchPlaceholder;

            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (currentDict[key]) {
                    el.innerText = currentDict[key];
                }
            });
        }

        function updateDashboardView() {
            renderTabContent();
        }

        // Initialize Defaults
        setLanguage('ar');
    