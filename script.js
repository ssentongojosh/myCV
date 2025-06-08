

    // PDF Generation Functionality
    document.getElementById('download-cv').addEventListener('click', function() {
      generatePDF();
    });

    async function generatePDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Show loading indicator
      const button = document.getElementById('download-cv');
      const originalText = button.innerHTML;
      button.innerHTML = '⏳ Generating PDF...';
      button.disabled = true;

      try {
        // Get data from website
        const profileData = getProfileData();
        const aboutData = getAboutData();
        const skillsData = getSkillsData();
        const projectsData = getProjectsData();
        const contactData = getContactData();

        // PDF styling
        let yPosition = 20;
        const leftMargin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - 40;

        // Header with name and title
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(profileData.name, leftMargin, yPosition);
        
        yPosition += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(profileData.title, leftMargin, yPosition);
        
        yPosition += 8;
        doc.setFontSize(12);
        doc.text(profileData.description, leftMargin, yPosition);
        
        // Add line separator
        yPosition += 15;
        doc.setDrawColor(200, 200, 200);
        doc.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
        yPosition += 15;

        // About Section
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("About Me", leftMargin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const aboutLines = doc.splitTextToSize(aboutData, contentWidth);
        doc.text(aboutLines, leftMargin, yPosition);
        yPosition += aboutLines.length * 5 + 10;

        // Skills Section
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Skills & Technologies", leftMargin, yPosition);
        yPosition += 10;

        // Technical Skills
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Technical Skills:", leftMargin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        skillsData.technical.forEach(skill => {
          doc.text(`• ${skill.name}: ${skill.level}%`, leftMargin + 5, yPosition);
          yPosition += 6;
        });

        // Tools & Technologies
        yPosition += 5;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Tools & Technologies:", leftMargin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const toolsText = skillsData.tools.join(", ");
        const toolsLines = doc.splitTextToSize(`${toolsText}`, contentWidth - 5);
        doc.text(toolsLines, leftMargin + 5, yPosition);
        yPosition += toolsLines.length * 5 + 10;

        // Projects Section
        if (projectsData.length > 0) {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("Projects", leftMargin, yPosition);
          yPosition += 10;

          projectsData.forEach(project => {
            // Check if we need a new page
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(project.title, leftMargin, yPosition);
            yPosition += 8;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const projectLines = doc.splitTextToSize(project.description, contentWidth);
            doc.text(projectLines, leftMargin, yPosition);
            yPosition += projectLines.length * 5 + 8;
          });
        }

        // Contact Information
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Contact Information", leftMargin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        contactData.forEach(contact => {
          doc.text(`${contact.type}: ${contact.value}`, leftMargin, yPosition);
          yPosition += 6;
        });

        // Add footer
        const today = new Date().toLocaleDateString();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${today} from ssentongo.dev`, leftMargin, doc.internal.pageSize.height - 10);

        // Save the PDF
        doc.save('Ssentongo_CV.pdf');

      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      } finally {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
      }
    }

    // Extract profile data from website
    function getProfileData() {
      const name = document.querySelector('.profile-name')?.textContent || 'Ssentongo';
      const title = document.querySelector('.profile-title')?.textContent || 'Software Engineering Student';
      const description = document.querySelector('.profile-description')?.textContent || 'Passionate developer exploring cybersecurity and full-stack development';
      
      return { name, title, description };
    }

    // Extract about data
    function getAboutData() {
      const aboutSection = document.querySelector('#about');
      const paragraphs = aboutSection.querySelectorAll('p');
      let aboutText = '';
      
      paragraphs.forEach((p, index) => {
        if (!p.querySelector('.cv-download')) { // Skip paragraph with download button
          aboutText += p.textContent.trim();
          if (index < paragraphs.length - 1) aboutText += '\n\n';
        }
      });
      
      return aboutText;
    }

    // Extract skills data
    function getSkillsData() {
      const skillItems = document.querySelectorAll('.skill-item');
      const technical = [];
      
      skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-header strong')?.textContent;
        const skillLevel = item.querySelector('.skill-header span:last-child')?.textContent;
        
        if (skillName && skillLevel) {
          technical.push({
            name: skillName,
            level: skillLevel.replace('%', '')
          });
        }
      });

      const toolTags = document.querySelectorAll('.tool-tag');
      const tools = Array.from(toolTags).map(tag => tag.textContent.trim());

      return { technical, tools };
    }

    // Extract projects data
    function getProjectsData() {
      const projects = [];
      const projectElements = document.querySelectorAll('.project');
      
      projectElements.forEach(project => {
        const title = project.querySelector('h3')?.textContent;
        const description = project.querySelector('p')?.textContent;
        
        if (title && description) {
          projects.push({ title, description });
        }
      });
      
      return projects;
    }

    // Extract contact data
    function getContactData() {
      const contactData = [
        { type: 'Email', value: 'your.email@example.com' },
        { type: 'GitHub', value: 'github.com/yourusername' },
        { type: 'LinkedIn', value: 'linkedin.com/in/yourusername' }
      ];
      
      // Try to extract from social links if they exist
      const socialLinks = document.querySelectorAll('.social-links a');
      const extractedContacts = [];
      
      socialLinks.forEach(link => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        
        if (href && href.includes('github')) {
          extractedContacts.push({ type: 'GitHub', value: href });
        } else if (href && href.includes('linkedin')) {
          extractedContacts.push({ type: 'LinkedIn', value: href });
        } else if (href && href.includes('mailto')) {
          extractedContacts.push({ type: 'Email', value: href.replace('mailto:', '') });
        }
      });
      
      return extractedContacts.length > 0 ? extractedContacts : contactData;
    }
 