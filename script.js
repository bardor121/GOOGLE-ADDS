document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // FAQ Accordion Logic
    // ============================================
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer) {
        const questions = faqContainer.querySelectorAll('.faq-question');
        
        questions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const arrow = question.querySelector('.faq-arrow');
                const isAnswerOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

                // Close all other answers
                questions.forEach(q => {
                    if (q !== question) {
                        q.nextElementSibling.style.maxHeight = '0px';
                        q.querySelector('.faq-arrow').classList.remove('rotate-180');
                    }
                });

                // Toggle the current answer
                if (isAnswerOpen) {
                    answer.style.maxHeight = '0px';
                    arrow.classList.remove('rotate-180');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    arrow.classList.add('rotate-180');
                }
            });
        });
    }

    // ============================================
    // Smooth Scrolling Logic
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ============================================
    // Gemini API Feature Logic (Process Analyzer)
    // ============================================
    const generateBtn = document.getElementById('generate-idea-btn');
    const processDescription = document.getElementById('process-description');
    const resultContainer = document.getElementById('gemini-result-container');
    const geminiLoader = document.getElementById('gemini-loader');
    const geminiResponseEl = document.getElementById('gemini-response');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const userInput = processDescription.value;
            if (!userInput.trim()) {
                geminiResponseEl.textContent = 'אנא תארו תהליך כדי שנוכל להציע רעיון לאוטומציה.';
                resultContainer.classList.remove('hidden');
                return;
            }

            resultContainer.classList.remove('hidden');
            geminiLoader.style.display = 'flex';
            geminiResponseEl.textContent = '';

            try {
                const prompt = `You are an expert automation consultant for a digital agency. Your goal is to show potential clients the power of automation by providing a clear, actionable workflow idea. The user has described a manual business process in Hebrew. Your response must be in Hebrew.

                Analyze the user's process and suggest a specific, step-by-step automation workflow. Use tools like n8n, Zapier, Make, Google Sheets, Airtable, Gmail, etc.

                Structure your response clearly:
                1.  Start with an encouraging sentence acknowledging their process.
                2.  Provide a "שלב-אחר-שלב" (Step-by-step) breakdown of the proposed automation.
                3.  End with a friendly call to action, inviting them to contact the agency to implement the solution.

                User's process: "${userInput}"`;

                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = "AIzaSyBaXQVGGCCg-w_quSov_c7sE5Tn-TbiRR0"; // API Key Added
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`שגיאת רשת: ${response.status}`);

                const result = await response.json();
                let text = 'לא הצלחנו לעבד את הבקשה. נסו שוב מאוחר יותר.';
                if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
                    text = result.candidates[0].content.parts[0].text;
                }
                geminiResponseEl.textContent = text;
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                geminiResponseEl.textContent = 'אירעה שגיאה. אנא נסו שוב מאוחר יותר.';
            } finally {
                geminiLoader.style.display = 'none';
            }
        });
    }

    // ============================================
    // Gemini API Feature Logic (ROI Calculator)
    // ============================================
    const calculateRoiBtn = document.getElementById('calculate-roi-btn');
    const roiProblem = document.getElementById('roi-problem');
    const roiHours = document.getElementById('roi-hours');
    const roiResultContainer = document.getElementById('roi-result-container');
    const roiLoader = document.getElementById('roi-loader');
    const roiResponseEl = document.getElementById('roi-response');

    if (calculateRoiBtn) {
        calculateRoiBtn.addEventListener('click', async () => {
            const problemInput = roiProblem.value;
            const hoursInput = roiHours.value;

            if (!problemInput.trim() || !hoursInput.trim()) {
                roiResponseEl.textContent = 'אנא תארו את הבעיה ומלאו את מספר השעות החודשיות.';
                roiResultContainer.classList.remove('hidden');
                return;
            }

            roiResultContainer.classList.remove('hidden');
            roiLoader.style.display = 'flex';
            roiResponseEl.textContent = '';

            try {
                const prompt = `You are an expert business automation ROI analyst. Your response must be in Hebrew.
                A potential client has described a business problem and estimated the number of manual hours it costs them per month. Assume an average hourly cost of $50 for an employee in your calculations.

                Your task is to:
                1.  Briefly acknowledge the problem.
                2.  Suggest a high-level automation solution (e.g., "using a tool like n8n to connect your email to a CRM").
                3.  Calculate the "חיסכון חודשי מוערך" by multiplying the hours by $50 and presenting it in shekels (assume 1 USD = 3.7 ILS).
                4.  Estimate the "החזר השקעה (ROI) שנתי" assuming a one-time development cost of $1500. The ROI formula is ((Total Annual Savings - Cost) / Cost) * 100.
                5.  Present the results clearly with bold headings.
                6.  End with a call to action: "רוצים להפוך את החיסכון הזה למציאות? דברו איתנו."

                User's problem: "${problemInput}"
                Monthly hours wasted: ${hoursInput}`;

                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = "AIzaSyBaXQVGGCCg-w_quSov_c7sE5Tn-TbiRR0"; // API Key Added
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`שגיאת רשת: ${response.status}`);

                const result = await response.json();
                let text = 'לא הצלחנו לעבד את הבקשה. נסו שוב מאוחר יותר.';
                if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
                    text = result.candidates[0].content.parts[0].text;
                }
                roiResponseEl.textContent = text;
            } catch (error) {
                console.error("Error calling Gemini API for ROI:", error);
                roiResponseEl.textContent = 'אירעה שגיאה. אנא נסו שוב מאוחר יותר.';
            } finally {
                roiLoader.style.display = 'none';
            }
        });
    }


    // ============================================
    // n8n Webhook Form Submission Logic
    // ============================================
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const submitBtn = document.getElementById("submit-btn");
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "שולח...";
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("https://bbibodds.app.n8n.cloud/webhook/465dd117-07a8-4e30-97ed-072eb19033c2", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(data).toString()
                });

                if (response.ok) {
                    submitBtn.textContent = "✔ נשלח בהצלחה!";
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    const errorText = await response.text();
                    console.error("Server error details:", errorText);
                    throw new Error(`שגיאה בשרת, קוד: ${response.status}`);
                }
            } catch (error) {
                console.error("Form submission error:", error);
                submitBtn.textContent = "שגיאה. נסה שוב";
                submitBtn.disabled = false;
            }
        });
    }

    // ============================================
    // Coupon Popup Logic
    // ============================================
    const trigger = document.getElementById('coupon-trigger');
    const modal = document.getElementById('coupon-modal');
    const closeModal = document.getElementById('close-modal');
    const couponForm = document.getElementById('coupon-form');
    const successMsg = document.getElementById('success-msg');

    if (trigger && modal && closeModal && couponForm) {
        trigger.addEventListener('click', () => {
          modal.classList.remove('hidden');
        });

        closeModal.addEventListener('click', () => {
          modal.classList.add('hidden');
        });

        window.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });

        couponForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const submitButton = couponForm.querySelector('button[type="submit"]');
          const originalButtonText = submitButton.innerHTML;
          submitButton.innerHTML = 'שולח...';
          submitButton.disabled = true;

          const formData = new FormData(couponForm);
          const data = Object.fromEntries(formData.entries());

          try {
            const response = await fetch('https://bbibodds.app.n8n.cloud/webhook/986b0bef-7d0b-4f48-aa1a-c0db697d07cb', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams(data).toString()
            });

            if (response.ok) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                  couponForm.reset();
                  modal.classList.add('hidden');
                  successMsg.style.display = 'none';
                  submitButton.innerHTML = originalButtonText;
                  submitButton.disabled = false;
                }, 3000);
            } else {
                const errorText = await response.text();
                console.error("Server error details:", errorText);
                throw new Error(`שגיאה בשרת, קוד: ${response.status}`);
            }
          } catch (error) {
            console.error("Popup form submission error:", error);
            alert('⚠️ קרתה שגיאה. נסה שוב מאוחר יותר.');
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
          }
        });
    }
});
