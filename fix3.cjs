const fs = require('fs');
const file = 'src/pages/AppointmentPage.tsx';
let data = fs.readFileSync(file, 'utf8');

const newSubmit = `  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      const topicStr = Array.isArray(topics) ? topics.join(', ') : (topics || '一般諮詢');
      const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      await fetch('/.netlify/functions/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUserId,
          date: dateStr,
          timeSlot: selectedSlot || '',
          topic: topicStr,
          contactName: profile?.name || '',
          phone: phone || '',
          notes: note || ''
        })
      });
      setStep(4);
    } catch (e) {
      setToastMsg('預約失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };`;

data = data.replace(/const submitBooking = async \(\) => \{(.|\n)*?  \};/m, newSubmit);
fs.writeFileSync(file, data);
