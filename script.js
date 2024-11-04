const { jsPDF } = window.jspdf;
const skillsSet = new Set();

document.getElementById('add-skill').addEventListener('click', function() {
    const skillInput = document.createElement('input');
    skillInput.type = 'text';
    skillInput.placeholder = 'Skill';
    document.getElementById('skills-container').appendChild(skillInput);
});

document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const education = document.getElementById('education').value.trim();
    const experience = document.getElementById('experience').value.trim();

    const skillInputs = document.querySelectorAll('#skills-container input');
    skillsSet.clear();
    skillInputs.forEach(input => {
        const skill = input.value.trim();
        if (skill) skillsSet.add(skill);
    });

    const resumeOutput = `
        <h2>${name}</h2>
        <p>Email: ${email}</p>
        <h3>Summary</h3>
        <p>${summary}</p>
        <h3>Education</h3>
        <p>${education}</p>
        <h3>Experience</h3>
        <p>${experience}</p>
        <h3>Skills</h3>
        <p>${Array.from(skillsSet).join(', ') || 'No skills added.'}</p>
    `;
    
    document.getElementById('resume-output').innerHTML = resumeOutput;
    document.getElementById('download-resume').style.display = 'block';
    localStorage.setItem('resumeData', JSON.stringify({ name, email, summary, education, experience, skills: Array.from(skillsSet) }));
});

document.getElementById('download-resume').addEventListener('click', function() {
    const theme = document.getElementById('theme').value;
    const colors = {
        'light-blue': { background: '#E3F2FD', text: '#0D47A1', header: '#1976D2' },
        'dark': { background: '#2E2E2E', text: '#FFFFFF', header: '#4CAF50' },
        'green': { background: '#E8F5E9', text: '#1B5E20', header: '#388E3C' }
    };

    const { background, text, header } = colors[theme];

    const doc = new jsPDF();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const education = document.getElementById('education').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const skills = Array.from(skillsSet).join(', ');

    doc.setFillColor(background);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(header);
    doc.setFontSize(22);
    doc.text(name, 20, 30);

    doc.setTextColor(text);
    doc.setFontSize(12);
    doc.text(`Email: ${email}`, 20, 40);

    doc.setTextColor(header);
    doc.setFontSize(16);
    doc.text('Summary', 20, 55);
    doc.setTextColor(text);
    doc.text(doc.splitTextToSize(summary, 170), 20, 65);

    doc.setTextColor(header);
    doc.setFontSize(16);
    doc.text('Education', 20, 90);
    doc.setTextColor(text);
    doc.text(doc.splitTextToSize(education, 170), 20, 100);

    doc.setTextColor(header);
    doc.setFontSize(16);
    doc.text('Experience', 20, 125);
    doc.setTextColor(text);
    doc.text(doc.splitTextToSize(experience, 170), 20, 135);

    doc.setTextColor(header);
    doc.setFontSize(16);
    doc.text('Skills', 20, 160);
    doc.setTextColor(text);
    doc.text(skills, 20, 170);

    doc.save(`resume_${name}.pdf`);
});

window.addEventListener('load', function() {
    const savedData = JSON.parse(localStorage.getItem('resumeData'));
    if (savedData) {
        document.getElementById('name').value = savedData.name;
        document.getElementById('email').value = savedData.email;
        document.getElementById('summary').value = savedData.summary;
        document.getElementById('education').value = savedData.education;
        document.getElementById('experience').value = savedData.experience;
        savedData.skills.forEach(skill => {
            const skillInput = document.createElement('input');
            skillInput.type = 'text';
            skillInput.value = skill;
            document.getElementById('skills-container').appendChild(skillInput);
        });
    }
});
