// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
document.addEventListener('DOMContentLoaded', () => {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1317932897357009029/3F0rmujUWxSpqPBildf3YllAyoEFb_cS4nNbckUUD7HHtDFLNsCW2IDkd4-KbBuUQV3Z';
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            embeds: [{
                title: '🎉 New Reservation Request',
                color: 0xff4757,
                fields: [
                    {
                        name: '👤 Guest Name',
                        value: formData.get('name'),
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: formData.get('email'),
                        inline: true
                    },
                    {
                        name: '📱 Phone',
                        value: formData.get('phone'),
                        inline: true
                    },
                    {
                        name: '📅 Date',
                        value: formData.get('date'),
                        inline: true
                    },
                    {
                        name: '⏰ Time',
                        value: formData.get('time'),
                        inline: true
                    },
                    {
                        name: '👥 Number of Guests',
                        value: formData.get('guests'),
                        inline: true
                    },
                    {
                        name: '📝 Special Requests',
                        value: formData.get('special-requests') || 'None'
                    }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('Reservation submitted successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to submit reservation');
            }
        } catch (error) {
            showNotification('Failed to submit reservation. Please try again.', 'error');
        }
    });
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    timeInput.addEventListener('change', () => {
        const selectedTime = timeInput.value;
        const [hours, minutes] = selectedTime.split(':');
        const time = parseInt(hours);

        if (time < 8 || time >= 23) {
            timeInput.setCustomValidity('Please select a time between 8:00 AM and 11:00 PM');
        } else {
            timeInput.setCustomValidity('');
        }
    });
});
