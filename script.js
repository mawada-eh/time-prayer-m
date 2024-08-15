

let countdownInterval; // متغير لتخزين العداد 

document.getElementById('city-select').addEventListener('change', function() {
    const city = this.value;
    clearInterval(countdownInterval); // إيقاف العداد الحالي
    fetchPrayerTimes(city); // جلب أوقات الصلاة للمدينة المختارة
});

function fetchPrayerTimes(city) {
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=ليبيا&method=2`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //  اسم المدينة والتواريخ
            const hijriDate = data.data.date.hijri;
            const gregorianDate = data.data.date.gregorian;

            document.getElementById('city-name').innerText = city;
            document.getElementById('hijri-date').innerText = `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year} `;
            document.getElementById('gregorian-date').innerText = formatGregorianDate(gregorianDate);

            //  أوقات الصلاة
            const timings = data.data.timings;
            document.getElementById('fajr').innerText = timings.Fajr;
            document.getElementById('sunrise').innerText = timings.Sunrise;
            document.getElementById('dhuhr').innerText = timings.Dhuhr;
            document.getElementById('asr').innerText = timings.Asr;
            document.getElementById('maghrib').innerText = timings.Maghrib;
            document.getElementById('isha').innerText = timings.Isha;

            // حساب الوقتت المتبفي للصلاة 
            calculateCountdown(timings);
        })
        .catch(error => console.error('Error fetching prayer times:', error));
}

function formatGregorianDate(gregorianDate) {
    const months = {
        '01': 'يناير',
        '02': 'فبراير',
        '03': 'مارس',
        '04': 'أبريل',
        '05': 'مايو',
        '06': 'يونيو',
        '07': 'يوليو',
        '08': 'أغسطس',
        '09': 'سبتمبر',
        '10': 'أكتوبر',
        '11': 'نوفمبر',
        '12': 'ديسمبر'
    };

    const day = gregorianDate.day;
    const month = months[gregorianDate.month.number.toString().padStart(2, '0')];
    const year = gregorianDate.year;

    return `${day} ${month} ${year}`;
}

function calculateCountdown(timings) {
    const now = new Date();
    const times = [
        { name: 'الفجر', time: timings.Fajr },
        { name: 'الشروق', time: timings.Sunrise },
        { name: 'الظهر', time: timings.Dhuhr },
        { name: 'العصر', time: timings.Asr },
        { name: 'المغرب', time: timings.Maghrib },
        { name: 'العشاء', time: timings.Isha }
    ];

    let nextPrayer = null;
    for (let i = 0; i < times.length; i++) {
        const prayerTime = new Date(`${now.toDateString()} ${times[i].time}`);
        if (now < prayerTime) {
            nextPrayer = times[i];
            break;
        }
    }

    if (nextPrayer) {
        const countdownElement = document.getElementById('countdown');
        updateCountdown(countdownElement, nextPrayer.time);

        countdownInterval = setInterval(() => {
            updateCountdown(countdownElement, nextPrayer.time);
        }, 1000);
    }
}

function updateCountdown(element, prayerTime) {
    const now = new Date();
    const prayerDate = new Date(`${now.toDateString()} ${prayerTime}`);
    const diff = prayerDate - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    element.innerText = `${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
}


fetchPrayerTimes('اجدابيا');
