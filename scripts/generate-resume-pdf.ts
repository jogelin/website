import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cvData = JSON.parse(readFileSync(join(__dirname, '../src/content/cv/cv.json'), 'utf-8'));

// Format date helper
function formatDate(dateStr: string): string {
  if (dateStr === 'Present') return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Calculate years of experience
function getYearsOfExperience(): number {
  const startYear = 2006;
  const currentYear = new Date().getFullYear();
  return currentYear - startYear;
}

// Get all unique skills from all experiences
function getAllSkills(): string[] {
  const allSkills = cvData.experiences.flatMap((exp: any) => exp.skills || []);
  const skillCount = allSkills.reduce((acc: any, skill: string) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(skillCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 30)
    .map(([skill]) => skill);
}

const keySkills = getAllSkills();
const allExperiences = cvData.experiences;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jonathan Gelin - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Georgia, serif;
      background: #ffffff;
      color: #000000;
      font-size: 10pt;
      line-height: 1.4;
    }
    
    .page {
      width: 210mm;
      padding: 15mm 20mm;
      background: #ffffff;
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 12pt;
      padding-bottom: 10pt;
      border-bottom: 2px solid #000000;
    }
    
    .name {
      font-size: 22pt;
      font-weight: bold;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 6pt;
    }
    
    .title {
      font-size: 12pt;
      font-weight: normal;
      color: #333333;
      margin-bottom: 8pt;
    }
    
    .contact-line {
      font-size: 9pt;
      color: #333333;
    }
    
    .contact-line a {
      color: #000000;
      text-decoration: none;
    }
    
    .contact-separator {
      margin: 0 8pt;
    }
    
    /* Section styling */
    .section {
      margin-bottom: 14pt;
    }
    
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8pt;
      padding-bottom: 3pt;
      border-bottom: 1px solid #000000;
    }
    
    /* Summary */
    .summary {
      font-size: 10pt;
      color: #222222;
      line-height: 1.5;
      text-align: justify;
    }
    
    .summary p {
      margin-bottom: 8pt;
    }
    
    .summary p:last-child {
      margin-bottom: 0;
    }
    
    /* Page break */
    .page-break {
      page-break-before: always;
    }
    
    /* Skills */
    .skills-list {
      font-size: 9pt;
      color: #222222;
      line-height: 1.6;
    }
    
    .skill-category {
      margin-bottom: 4pt;
    }
    
    .skill-category-title {
      font-weight: bold;
    }
    
    /* Experience */
    .experience {
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2pt;
    }
    
    .experience-role {
      font-size: 11pt;
      font-weight: bold;
      color: #000000;
    }
    
    .experience-date {
      font-size: 9pt;
      color: #333333;
      font-style: italic;
    }
    
    .experience-company-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4pt;
    }
    
    .experience-company {
      font-size: 10pt;
      font-weight: bold;
      color: #333333;
    }
    
    .experience-location {
      font-size: 9pt;
      color: #555555;
      font-style: italic;
    }
    
    .experience-description {
      font-size: 9pt;
      color: #222222;
      margin-bottom: 4pt;
      text-align: justify;
    }
    
    .accomplishments {
      font-size: 9pt;
      color: #222222;
      padding-left: 18pt;
      margin-bottom: 4pt;
    }
    
    .accomplishments li {
      margin-bottom: 2pt;
      line-height: 1.4;
    }
    
    .experience-skills {
      font-size: 8pt;
      color: #444444;
      margin-top: 4pt;
    }
    
    .experience-skills-label {
      font-weight: bold;
    }
    
    /* Education */
    .education-item {
      margin-bottom: 8pt;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    
    .education-degree {
      font-size: 10pt;
      font-weight: bold;
      color: #000000;
    }
    
    .education-date {
      font-size: 9pt;
      color: #333333;
      font-style: italic;
    }
    
    .education-school {
      font-size: 9pt;
      color: #333333;
    }
    
    /* Languages */
    .languages-list {
      font-size: 9pt;
    }
    
    .language-item {
      display: inline;
    }
    
    /* Two columns for skills */
    .two-columns {
      display: flex;
      gap: 20pt;
    }
    
    .column {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1 class="name">Jonathan Gelin</h1>
      <div class="title">Software Engineer | AI Engineer | Nx Expert</div>
      <div class="contact-line">
        ${cvData.email}
        <span class="contact-separator">|</span>
        ${cvData.country}
        <span class="contact-separator">|</span>
        <a href="https://smartsdlc.dev">smartsdlc.dev</a>
        <span class="contact-separator">|</span>
        <a href="https://linkedin.com/in/jgelin">linkedin.com/in/jgelin</a>
      </div>
    </div>
    
    <!-- Professional Summary -->
    <div class="section">
      <h2 class="section-title">Professional Summary</h2>
      <div class="summary">
        ${cvData.summary
          .split('\n\n')
          .map((p: string) => `<p>${p}</p>`)
          .join('')}
      </div>
    </div>
    
    <!-- Core Competencies -->
    <div class="section">
      <h2 class="section-title">Core Competencies</h2>
      <div class="skills-list">
        <div class="skill-category">
          <span class="skill-category-title">AI Engineering:</span> Agentic AI, Claude Code Hooks, AI-assisted Development, Code Analysis, Architecture Validation, Automated Workflows
        </div>
        <div class="skill-category">
          <span class="skill-category-title">Architecture:</span> Monorepo (Nx), Micro-Frontends, Single-spa, Module Federation, SystemJS, Distributed Caching, Distributed Task Execution
        </div>
        <div class="skill-category">
          <span class="skill-category-title">Frontend:</span> TypeScript, Angular, React, RxJS, Tailwind CSS, SASS, Webpack, Storybook
        </div>
        <div class="skill-category">
          <span class="skill-category-title">Backend:</span> Node.js, NestJS, GraphQL, Java, Spring Boot, Python, Go, .NET
        </div>
        <div class="skill-category">
          <span class="skill-category-title">DevOps & Tools:</span> CI/CD, GitLab, GitHub Actions, Azure DevOps, Docker, Kubernetes, Jest, Cypress, Playwright
        </div>
        <div class="skill-category">
          <span class="skill-category-title">Methodologies:</span> Agile, Scrum, Kanban, XP (Extreme Programming), TDD, BDD, Code Review, Pair Programming
        </div>
      </div>
    </div>
    
    <!-- Education -->
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${cvData.education
        .map(
          (edu: any) => `
        <div class="education-item">
          <div class="education-header">
            <span class="education-degree">${edu.studyType}</span>
            <span class="education-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
          </div>
          <div class="education-school">${edu.institution}, ${edu.location}</div>
        </div>
      `,
        )
        .join('')}
    </div>
    
    <!-- Languages -->
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="languages-list">
        ${cvData.languages.map((lang: any) => `<span class="language-item"><strong>${lang.language}:</strong> ${lang.fluency}</span>`).join(' | ')}
      </div>
    </div>
    
    <!-- Page break before Professional Experience -->
    <div class="page-break"></div>
    
    <!-- Professional Experience -->
    <div class="section">
      <h2 class="section-title">Professional Experience</h2>
      ${allExperiences
        .map(
          (exp: any) => `
        <div class="experience">
          <div class="experience-header">
            <span class="experience-role">${exp.role}</span>
            <span class="experience-date">${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</span>
          </div>
          <div class="experience-company-line">
            <span class="experience-company">${exp.companyName}</span>
            ${exp.location ? `<span class="experience-location">${exp.location}</span>` : ''}
          </div>
          <div class="experience-description">${exp.description}</div>
          ${
            exp.accomplishments && exp.accomplishments.length > 0
              ? `
            <ul class="accomplishments">
              ${exp.accomplishments.map((acc: string) => `<li>${acc}</li>`).join('')}
            </ul>
          `
              : ''
          }
          <div class="experience-skills">
            <span class="experience-skills-label">Technologies:</span> ${(exp.skills || []).join(', ')}
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  </div>
</body>
</html>
`;

async function generatePDF() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  console.log('Setting content...');
  await page.setContent(html, {
    waitUntil: 'networkidle0',
  });

  const outputPath = join(__dirname, '../jonathan-gelin-resume.pdf');

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '0',
      bottom: '15mm',
      left: '0',
    },
  });

  await browser.close();

  console.log(`PDF generated successfully: ${outputPath}`);
}

generatePDF().catch(console.error);
