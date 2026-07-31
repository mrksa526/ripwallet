// =========================
// INTERNATIONALIZATION (i18n)
// =========================

const I18N = {
    currentLang: "en",

    translations: {
        en: {
            // Homepage
            heroTitle: "Welcome to RipWallet",
            heroSubtitle: "Whiteout survival calculator tools",
            eventsTitle: "Event Timers",
            calculatorsTitle: "Calculators",
            open: "Open",
            soon: "Soon",
            comingSoon: "Coming Soon",

            // Event status
            going: "🔴 OnGoing",
            upcoming: "⏳ Soon",
            endsIn: "Ends In",
            startsIn: "Starts In",
            day: "day",
            hour: "hour",
            minute: "minute",
            second: "second",

            // Event badge labels
            badgeDaily: "Daily",
            badgeWeekly: "Weekly",
            badgeBiweekly: "Every 2 Weeks",
            badgeMonthly: "Monthly",
            badgeOnce: "One-Time",

            // Event names
            eventSunfire: "SunFire Castle",
            eventArena: "Arena",
            eventFrostmine: "Frostmine",
            eventAllianceDuel: "Alliance Championship",
            eventSvS: "State vs State",
            eventJourney: "Journey of Light",
            EVENT_RISSY_BDAY: "Rissy's Birthday",
            daily: "Daily",

            // Tool Cards
            training: "Training",
            trainingDesc: "Training & Promotion Calculator",
            gear: "Gear",
            gearDesc: "Chief Gear Upgrade Calculator",
            charms: "Charms",
            charmsDesc: "Charms Upgrade Calculator",
            experts: "Experts",
            construction: "Construction",

            // Navigation
            back: "Back",

            // Training Page
            trainingTitle: "Training Calculator",
            trainingSubtitle: "Calculate training efficiency based on buffs and camp capacity.",
            buffsTitle: "Training Speed Buffs",
            lblInfSpeed: "Infantry Training Speed (%)",
            lblLancSpeed: "Lancer Training Speed (%)",
            lblMarkSpeed: "Marksman Training Speed (%)",
            lblFCLevel: "FC Level",
            lblT11Research: "T11 Research",
            lblSpeedBuff: "Training Speed (%)",
            lblT12Research: "T12 Research",
            fcT12Locked: "Requires FC10",
            copy: "Copy",
            tab1: "Training Requirements",
            tab2: "Speedups to Troops",
            tab3: "T10 & T11 to T12 Upgrade",
            tab4: "Troop Reduction",
            s1Title: "Section 1: Detailed Requirements",
            s2Title: "Section 2: Speedups to Troops",
            s4Title: "Section 4: Troop Reduction Calculator",
            s4Step1: "Step 1: Power Targets",
            s4Step2: "Step 2: Current Troops",
            s4Step3: "Step 3: Desired Ratios",
            resetBtn: "Reset",
            troopInf: "Infantry",
            troopLanc: "Lancers",
            troopMark: "Marksmen",
            lblT10: "T10 Count",
            lblT11: "T11 Count",
            lblT12: "T12 Count",
            lblDays: "Days",
            lblHours: "Hours",
            lblMins: "Minutes",
            lblTier: "Target Tier",
            lblCap: "Camp Capacity",

            // Tab 4 labels
            lblCurrentPower: "Current Power",
            lblTargetPower: "Target Power",
            lblPowerToRemove: "Power to Remove",
            lblRatioTotal: "Ratio Total",
            none: "None",
            removeTotal: "Troops to Remove",
            keepTotal: "Troops to Keep",
            currentPower: "Current Power",
            targetPower: "Target Power",
            currentTroops: "Current Troops",
            current: "Current",
            finalTroops: "Final Troops",
            enterData: "Enter current power, target power, and troop counts",
            powerToRemove: "Power to Remove",
            errorNotEnoughPower: "Target power is too low — you need to remove more power than you have in troops",
            errorNoSolution: "Cannot achieve target with current troops and ratios",

            // Gear Page
            gearTitle: "Gear Upgrade Calculator",
            selectAll: "Select All",
            reset: "Reset",
            totalResources: "Total Resources Required",
            alloy: "Alloy",
            polishSolution: "Polish Solution",
            designPlans: "Design Plans",
            lunarAmber: "Lunar Amber",

            // Gear Card Labels
            setCurrentStatus: "Set Current Status",
            setTargetStatus: "Set Target Status",
            tierLevel: "Tier Level",
            stars: "Stars",
            upgradeSteps: "Upgrade Steps",
            targetUpgradeSteps: "Target Upgrade Steps",
            nextSetTarget: "Next: Set Target ➔",
            modifyCurrent: "⬅ Modify Current",
            currentSummary: "Current",

            // Gear Tiers
            gold: "Gold",
            gold_t1: "Gold T1",
            gold_t2: "Gold T2",
            red: "Red",
            red_t1: "Red T1",
            red_t2: "Red T2",
            red_t3: "Red T3",
            red_t4: "Red T4",
            base: "Base",

            // Gear Pieces
            helmet: "Helmet",
            watch: "Watch",
            coat: "Coat",
            pants: "Pants",
            cane: "Cane",
            ring: "Ring",

            // Resources
            time: "Time",
            power: "Power",
            wood: "Wood",
            meat: "Meat",
            coal: "Coal",
            iron: "Iron",
            total: "Grand Total",
            produced: "Total Produced",
            units: "troops",
            campFill: "Camps to Fill",

            // Charms
            charmsTitle: "Charms Upgrade Calculator",
            charmsGuide: "Charms Guide",
            charmsDesign: "Charms Design",
            charmsSecrets: "Charms Secrets",
            charmsAddCard: "Add Calculation",
            charmsCount: "Number of Charms",
            charmsCurrentLevel: "Current Level",
            charmsCurrentStep: "Current Step",
            charmsTargetLevel: "Target Level",
            charmsTargetStep: "Target Step",
            charmsNoSteps: "No steps at this level",
            charmsMaxReached: "Max 2 cards per type",
            charmsTotal: "Total Materials Required",
            charmsRemove: "✕",
            charmsLevel: "Level",
            charmsStep: "Step",
            charmsBelow8: "Below Level 8",
            charmsAvailable: "available",
            charmsCard: "card",
            charmsCards: "cards",

            // Language
            langBtn: "English"
        },

        ar: {
            // Homepage
            heroTitle: "مرحباً بك في RipWallet",
            heroSubtitle: "ادوات حساب لعبة النجاة في الصقيع",
            eventsTitle: "مؤقتات الفعاليات",
            calculatorsTitle: "الآلات الحاسبة",
            open: "دخول",
            soon: "قريباً",
            comingSoon: "قريباً",

            // Event status
            going: "🔴 جاري",
            upcoming: "⏳ قريباً",
            endsIn: "ينتهي بعد",
            startsIn: "يبدأ بعد",
            day: "يوم",
            hour: "ساعة",
            minute: "دقيقة",
            second: "ثانية",

            // Event badge labels
            badgeDaily: "يومي",
            badgeWeekly: "أسبوعي",
            badgeBiweekly: "كل أسبوعين",
            badgeMonthly: "شهري",
            badgeOnce: "مرة واحدة",

            // Event names
            eventSunfire: "قلعة الشمس",
            eventArena: "الساحة",
            eventFrostmine: "منجم الجليد",
            eventAllianceDuel: "بطولة التحالف",
            eventSvS: "ولاية ضد ولاية",
            eventJourney: "رحلة النور",
            EVENT_RISSY_BDAY: "عيد ميلاد ريسي",
            daily: "يومي",

            // Tool Cards
            training: "التدريب",
            trainingDesc: "حاسبة التدريب والترقية",
            gear: "العتاد",
            gearDesc: "حاسبة تطوير عتاد القائد",
            charms: "التمائم",
            charmsDesc: "حاسبة تطوير التمائم",
            experts: "الخبراء",
            construction: "البناء",

            // Navigation
            back: "رجوع",

            // Training Page
            trainingTitle: "حاسبة التدريب",
            trainingSubtitle: "احسب كفاءة التدريب بناءً على التعزيزات وسعة المعسكر.",
            buffsTitle: "تعزيزات سرعة التدريب",
            lblInfSpeed: "تعزيز سرعة المشاة (%)",
            lblLancSpeed: "تعزيز سرعة الرماح (%)",
            lblMarkSpeed: "تعزيز سرعة الرماة (%)",
            lblFCLevel: "مستوى القلعة (FC)",
            lblT11Research: "بحث T11",
            lblSpeedBuff: "تعزيز سرعة التدريب (%)",
            lblT12Research: "بحث T12",
            fcT12Locked: "يتطلب FC10",
            copy: "نسخ",
            tab1: "متطلبات التدريب",
            tab2: "تسريعات إلى جنود",
            tab3: "ترقية T10 و T11 إلى T12",
            tab4: "تقليل الجنود",
            s1Title: "القسم 1: المتطلبات التفصيلية",
            s2Title: "القسم 2: تسريعات إلى جنود",
            s4Title: "القسم 4: حاسبة تقليل الجنود",
            s4Step1: "الخطوة 1: أهداف القوة",
            s4Step2: "الخطوة 2: الجنود الحالية",
            s4Step3: "الخطوة 3: النسب المطلوبة",
            resetBtn: "إعادة تعيين",
            troopInf: "المشاة",
            troopLanc: "الرماح",
            troopMark: "الرماة",
            lblT10: "عدد T10",
            lblT11: "عدد T11",
            lblT12: "عدد T12",
            lblDays: "أيام",
            lblHours: "ساعات",
            lblMins: "دقائق",
            lblTier: "النوع المستهدف",
            lblCap: "سعة المعسكر",

            // Tab 4 labels
            lblCurrentPower: "القوة الحالية",
            lblTargetPower: "القوة المستهدفة",
            lblPowerToRemove: "القوة للإزالة",
            lblRatioTotal: "مجموع النسب",
            none: "لا شيء",
            removeTotal: "الجنود للإزالة",
            keepTotal: "الجنود للاحتفاظ",
            currentPower: "القوة الحالية",
            targetPower: "القوة المستهدفة",
            currentTroops: "الجنود الحالية",
            current: "الحالية",
            finalTroops: "الجنود النهائية",
            enterData: "أدخل القوة الحالية والمستهدفة وعدد الجنود",
            powerToRemove: "القوة للإزالة",
            errorNotEnoughPower: "القوة المستهدفة منخفضة جداً — تحتاج لإزالة قوة أكثر مما لديك من جنود",
            errorNoSolution: "لا يمكن تحقيق الهدف بالجنود والنسب الحالية",

            // Gear Page
            gearTitle: "حاسبة تطوير العتاد",
            selectAll: "تحديد الكل",
            reset: "إعادة تعيين",
            totalResources: "إجمالي الموارد المطلوبة",
            alloy: "سبائك",
            polishSolution: "محلول التلميع",
            designPlans: "خطط التصميم",
            lunarAmber: "كهرمان القمر",

            // Gear Card Labels
            setCurrentStatus: "تعيين الحالة الحالية",
            setTargetStatus: "تعيين الحالة المستهدفة",
            tierLevel: "مستوى الدرجة",
            stars: "النجوم",
            upgradeSteps: "خطوات التطوير",
            targetUpgradeSteps: "خطوات التطوير المستهدفة",
            nextSetTarget: "التالي: تعيين الهدف ➔",
            modifyCurrent: "⬅ تعديل الحالة الحالية",
            currentSummary: "الحالية",

            // Gear Tiers
            gold: "ذهبي",
            gold_t1: "ذهبي T1",
            gold_t2: "ذهبي T2",
            red: "أحمر",
            red_t1: "أحمر T1",
            red_t2: "أحمر T2",
            red_t3: "أحمر T3",
            red_t4: "أحمر T4",
            base: "الأساسي",

            // Gear Pieces
            helmet: "الخوذة",
            watch: "الساعة",
            coat: "المعطف",
            pants: "البنطال",
            cane: "العصا",
            ring: "الخاتم",

            // Resources
            time: "الوقت",
            power: "القوة",
            wood: "الخشب",
            meat: "اللحم",
            coal: "الفحم",
            iron: "الحديد",
            total: "المجموع الكلي",
            produced: "إجمالي الجنود",
            units: "جندي",
            campFill: "تدريبات للملء",

            // Charms
            charmsTitle: "حاسبة تطوير التمائم",
            charmsGuide: "دليل التمائم",
            charmsDesign: "تصميم التمائم",
            charmsSecrets: "أسرار التمائم",
            charmsAddCard: "إضافة حساب",
            charmsCount: "عدد التمائم",
            charmsCurrentLevel: "المستوى الحالي",
            charmsCurrentStep: "الخطوة الحالية",
            charmsTargetLevel: "المستوى المستهدف",
            charmsTargetStep: "الخطوة المستهدفة",
            charmsNoSteps: "لا توجد خطوات في هذا المستوى",
            charmsMaxReached: "الحد الأقصى بطاقتان لكل نوع",
            charmsTotal: "إجمالي المواد المطلوبة",
            charmsRemove: "✕",
            charmsLevel: "مستوى",
            charmsStep: "خطوة",
            charmsBelow8: "أقل من مستوى 8",
            charmsAvailable: "متاح",
            charmsCard: "بطاقة",
            charmsCards: "بطاقات",

            // Language
            langBtn: "العربية"
        }
    },

    t(key, fallback = "") {
        const dict = this.translations[this.currentLang] || this.translations["en"];
        const val = dict[key];
        if (val !== undefined && val !== null && val !== "") return val;
        const enVal = this.translations["en"][key];
        if (enVal !== undefined && enVal !== null && enVal !== "") return enVal;
        return fallback || key;
    },

    apply() {
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === "ar" ? "rtl" : "ltr";

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const val = this.t(key);
            if (val) el.textContent = val;
        });

        const langBtn = document.getElementById("langBtn");
        if (langBtn) {
            langBtn.textContent = this.currentLang === "ar" ? "English" : "العربية";
        }

        if (window.Renderers) {
            Renderers.renderHomepage();
        }
    },

    toggle() {
        this.currentLang = this.currentLang === "en" ? "ar" : "en";
        Storage.set("lang", this.currentLang);
        this.apply();

        const trainingView = document.getElementById("trainingView");
        if (trainingView && trainingView.classList.contains("active") && window.TrainingManager) {
            trainingView.innerHTML = "";
            TrainingManager.init();
        }
        const gearView = document.getElementById("gear_upgradeView");
        if (gearView && gearView.classList.contains("active") && window.GearManager) {
            gearView.innerHTML = "";
            GearManager.init();
        }
        const charmsView = document.getElementById("charmsView");
        if (charmsView && charmsView.classList.contains("active")) {
            charmsView.innerHTML = "";
       if (window.CharmsManager) CharmsManager.init();
        }
    },

    init() {
        const saved = Storage.get("lang");
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        } else {
            const bl = (navigator.language || navigator.userLanguage || "").toLowerCase();
            if (bl.startsWith("ar")) this.currentLang = "ar";
        }

        this.apply();

        const langBtn = document.getElementById("langBtn");
        if (langBtn) langBtn.addEventListener("click", () => this.toggle());
    }
};

window.I18N = I18N;
