export const analyzeResume = (resumeText) => {
  try {
    console.log('Analyzing resume text:', resumeText.substring(0, 100) + (resumeText.length > 100 ? '...' : ''));

    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Invalid or empty resume text provided');
    }

    const normalizedText = resumeText.replace(/\s+/g, ' ').trim().toLowerCase();
    const originalText = resumeText;
    const wordCount = normalizedText.split(' ').length;
    const lines = originalText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const technicalSkills = {
      programming: ['c', 'c++', 'c#', 'python', 'java', 'sql', 'javascript', 'asp.net', 'perl', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'typescript', 'dart', 'scala', 'r', 'bash', 'powershell'],
      webDevelopment: ['html', 'css', 'wordpress', 'content management system', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'rest api', 'graphql', 'webpack', 'bootstrap', 'sass', 'less'],
      cloudComputing: ['azure', 'aws', 'kubernetes', 'google cloud platform', 'ibm cloud', 'digital ocean', 'serverless', 'lambda functions', 'cloud formation', 'terraform'],
      machineLearning: ['tensorflow', 'scikit-learn', 'aml', 'google cloud ml engine', 'pytorch', 'keras', 'opencv', 'nltk', 'spacy', 'hugging face', 'computer vision', 'nlp'],
      devOps: ['docker', 'jenkins', 'ansible', 'terraform', 'git', 'github', 'gitlab', 'ci/cd', 'nginx', 'apache', 'linux administration'],
      database: ['mysql', 'postgresql', 'mongodb', 'sqlite', 'oracle', 'microsoft sql server', 'firebase', 'redis', 'cassandra', 'elasticsearch'],
      mobileDevelopment: ['react native', 'flutter', 'ios development', 'android development', 'xamarin', 'ionic', 'swiftui', 'jetpack compose'],
      ai: ['generative ai', 'llms', 'chatgpt', 'langchain', 'computer vision', 'natural language processing', 'reinforcement learning'],
      cybersecurity: ['threat intelligence', 'incident response', 'digital forensics', 'malware analysis', 'risk assessment'],
      networkSecurity: ['certified ethical hacker', 'cisco ccna', 'ocsp', 'cissp', 'comptia security', 'penetration testing', 'siem', 'soc', 'firewalls', 'vpn', 'ids/ips', 'owasp'],
      bigData: ['statistical analysis', 'data mining', 'database management', 'hadoop', 'spark', 'hive', 'kafka', 'airflow', 'tableau', 'power bi', 'qlik', 'data warehousing'],
      testing: ['unit testing', 'integration testing', 'selenium', 'jest', 'mocha', 'junit', 'testng', 'cypress', 'postman', 'load testing'],
      ecommerce: ['magento', 'prestashop', 'joomia', 'opencart', 'shopify', 'woocommerce', 'bigcommerce', 'salesforce commerce cloud', 'payment gateways', 'inventory management'],
      blockchain: ['bitcoin', 'ripple', 'ethereum', 'monero', 'solidity', 'smart contracts', 'hyperledger', 'web3.js', 'truffle', 'ganache', 'defi', 'nft'],
      iot: ['raspberry pi', 'arduino', 'sensors', 'mqtt', 'edge computing', 'industrial iot'],
      robotics: ['ros', 'computer vision', 'motion planning', 'control systems', 'industrial robotics'],
      electronics: ['autocad', 'matlab', 'simulink', 'multisim', 'etap', 'arduino', 'raspberry pi', 'embedded systems', 'pcb design', 'vlsi', 'verilog', 'vhdl'],
      gameDevelopment: ['unity', 'unreal engine', 'godot', 'cryengine', '3d modeling', 'blender', 'maya', 'animation'],
      virtualization: ['vmware', 'virtualbox', 'hyper-v', 'proxmox', 'containerization'],
      projectManagement: ['agile', 'scrum', 'kanban', 'jira', 'trello', 'asana', 'waterfall', 'prince2', 'pmp'],
      graphics: ['photoshop', 'illustrator', 'indesign', 'acrobat', 'free-hand', 'figma', 'sketch', 'adobe xd', 'coreldraw', 'gimp', 'canva', 'affinity designer'],
      video: ['shooting', 'framing', 'writing', 'editing', 'compressing', 'uploading', 'creative engagement', 'premiere pro', 'after effects', 'final cut pro', 'davinci resolve', 'motion graphics', 'color grading', 'sound design'],
      writing: ['wordpress', 'seo', 'yoast', 'ghost writing', 'journalism', 'technical writing', 'copywriting', 'content strategy', 'proofreading', 'creative writing'],
      microsoftOffice: ['word', 'excel', 'powerpoint', 'outlook', 'access', 'publisher', 'onenote', 'teams', 'sharepoint'],
      softSkills: ['communication', 'teamwork', 'problem-solving', 'leadership', 'time management', 'adaptability', 'critical thinking', 'creativity', 'emotional intelligence']};
    const allTechnicalSkills = Object.values(technicalSkills).flat();
    const skillCounts = Object.fromEntries(
      Object.keys(technicalSkills).map(category => [
        category,
        technicalSkills[category].reduce((count, skill) => count + (normalizedText.match(new RegExp(`\\b${escapeRegex(skill)}\\b`, 'g')) || []).length, 0)
      ])
    );
    const technicalSkillCount = Object.values(skillCounts).reduce((sum, count) => sum + count, 0);
    const skillDiversity = new Set(allTechnicalSkills.filter(skill => normalizedText.includes(skill))).size;

    const contactMatches = normalizedText.match(/\b(?:email|phone|mobile):?\s*[\w\+\-\(\)\s]*[\w\+\-\.]+\@[\w\+\-\.]+\.\w+|\b(?:linkedin\.com\/in\/|github\.com\/)[\w\-]+|\+\d{10,12}/ig) || [];
    const hasContactInfo = contactMatches.length > 0;
    const contactCount = contactMatches.length;
    const hasEmail = /\b[\w\+\-\.]+\@[\w\+\-\.]+\.\w+/i.test(normalizedText);
    const hasPhone = /\+\d{10,12}/i.test(normalizedText);
    const hasLinkedIn = /\blinkedin\.com\/in\/[\w\-]+/i.test(normalizedText);
    const hasGitHub = /\bgithub\.com\/[\w\-]+/i.test(normalizedText);

    const hasWorkExperience = /\b(?:experience|work experience|professional experience|internship|full-time|contract|remote|senior|junior|lead|manager|engineer|developer|analyst|architect|[\w\s]+(?:intern|developer|engineer|analyst))\b|\b(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*-\s*(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\bpresent\b)/i.test(normalizedText);
    const experienceEntries = (normalizedText.match(/\b(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*-\s*(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\bpresent\b)/ig) || []).length;
    const experienceDuration = experienceEntries > 0 ? lines.filter(line => /\b(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*-\s*(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\bpresent\b)/i.test(line)).reduce((sum, line) => {
      const dates = line.match(/\b(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*-\s*(?:\d{1,2}(?:\/|-)\d{1,2}(?:\/|-)\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\bpresent\b)/i);
      if (dates) {
        const [start, end] = dates[0].split('-').map(d => d.trim());
        const months = 1; // Placeholder; implement actual date diff logic
        return sum + months;
      }
      return sum;
    }, 0) : 0;

    const hasEducation = /\b(?:education|degree|bachelor|master|phd|mba|university|college|institute|school|engineering|computer science|information technology|data science)\b/i.test(normalizedText);

    const hasSkills = technicalSkillCount > 0 || /\b(?:agile|scrum|devops|cloud|machine learning|deep learning|data analysis|problem-solving|team leadership|communication)\b/i.test(normalizedText);

    const quantifiableAchievements = normalizedText.match(/(?:\b\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[MK]?|\d+\s*(?:years?|months?|users?|customers?|projects?|hours?|items?)\b)|(?:improved|increased|reduced|optimized|achieved|delivered)\s+by\s+\d+(?:\.\d+)?%|(?:accuracy|performance|efficiency|revenue|growth|reduction)\s+of\s+\d+(?:\.\d+)?%|(?:handled|managed|led)\s+\d+\s*(?:team|project|task)s?/i) || [];
    const quantifiableAchievementCount = quantifiableAchievements.length;
    const achievementSpecificity = quantifiableAchievementCount > 0 && quantifiableAchievements.some(a => /by|of/.test(a)) ? 1 : 0;
    const achievementImpact = quantifiableAchievementCount > 0 ? quantifiableAchievements.filter(a => /\d+%|\$\d+[MK]?/.test(a)).length : 0;

    const requiredSections = ['contact', 'education', 'skills', 'experience'];
    const presentSections = requiredSections.filter(section => {
      if (section === 'contact') return hasContactInfo;
      if (section === 'education') return hasEducation;
      if (section === 'skills') return hasSkills;
      if (section === 'experience') return hasWorkExperience;
      return false;
    });

    const scoringWeights = {
      structure: 0.30,
      keywords: 0.40,
      experience: 0.20,
      metrics: 0.10
    };

    const scoringThresholds = {
      keywords: 15,
      experience: 2,
      metrics: 3
    };

    const structureScore = Math.round(
      presentSections.length === 4 ? 100 :
      presentSections.length === 3 ? 90 :
      presentSections.length === 2 ? 70 :
      presentSections.length === 1 ? 50 : 0
    );

    const contactScore = Math.round(
      contactCount >= 4 ? 100 :
      (hasEmail && hasPhone && hasLinkedIn) ? 95 :
      (hasEmail && hasPhone) || (hasEmail && hasLinkedIn) || (hasPhone && hasLinkedIn) ? 85 :
      (hasEmail || hasPhone || hasLinkedIn) ? 65 :
      0
    );

    const keywordScore = Math.round(
      Object.values(skillCounts).filter(count => count > 0).length >= 10 ? 100 :
      Object.values(skillCounts).filter(count => count > 0).length >= 7 ? 90 :
      Object.values(skillCounts).filter(count => count > 0).length >= 4 ? 80 :
      Object.values(skillCounts).filter(count => count > 0).length >= 2 ? 60 :
      skillDiversity >= 1 ? 40 : 0
    );

    const experienceScore = Math.round(
      experienceEntries >= 3 && experienceDuration >= 12 ? 100 :
      experienceEntries === 2 && experienceDuration >= 6 ? 90 :
      experienceEntries === 1 && experienceDuration >= 3 ? 80 :
      experienceEntries >= 1 ? 60 :
      hasWorkExperience ? 40 : 0
    );

    const metricsScore = Math.round(
      achievementSpecificity === 1 && achievementImpact >= 2 && quantifiableAchievementCount >= 4 ? 100 :
      achievementSpecificity === 1 && achievementImpact >= 1 && quantifiableAchievementCount >= 3 ? 90 :
      achievementSpecificity === 1 && quantifiableAchievementCount >= 2 ? 80 :
      achievementSpecificity === 1 && quantifiableAchievementCount === 1 ? 70 :
      quantifiableAchievementCount >= 1 ? 50 :
      0
    );

    const overallScore = Math.round(
      structureScore * scoringWeights.structure +
      keywordScore * scoringWeights.keywords +
      experienceScore * scoringWeights.experience +
      metricsScore * scoringWeights.metrics
    );

    const getScoreRange = (score) => {
      if (score <= 50) return 'Critical';
      if (score <= 70) return 'Needs Work';
      return 'Excellent';
    };

    const categories = [
      {
        name: 'Resume Format',
        score: structureScore,
        status: getScoreRange(structureScore),
        feedback: structureScore === 100
          ? 'All required sections (contact, education, skills, experience) are well-structured and present.'
          : structureScore >= 90
          ? `Missing 1 section (e.g., ${requiredSections.filter(s => !presentSections.includes(s))[0]}). Add it to enhance completeness.`
          : structureScore >= 70
          ? `Missing ${4 - presentSections.length} sections (e.g., ${requiredSections.filter(s => !presentSections.includes(s)).join(', ')}). Include these for a stronger structure.`
          : 'Only 1 section detected. Add at least 2-3 more (e.g., education, experience) to meet basic standards.'
      },
      {
        name: 'Contact Information',
        score: contactScore,
        status: getScoreRange(contactScore),
        feedback: contactScore === 100
          ? `Excellent contact details with ${contactCount} items, including ${contactMatches.map(m => m.split(':')[0]).join(', ')}.`
          : contactScore >= 95
          ? `Great contact setup with ${contactCount} items (${contactMatches.map(m => m.split(':')[0]).join(', ')}). Consider adding GitHub for extra visibility.`
          : contactScore >= 85
          ? `Solid contact info with ${contactCount} items (${contactMatches.map(m => m.split(':')[0]).join(', ')}). Add ${!hasPhone ? 'phone' : !hasGitHub ? 'GitHub' : 'another link'} to strengthen it.`
          : contactScore >= 65
          ? `Basic contact with ${contactCount} item (${contactMatches.map(m => m.split(':')[0]).join(', ')}). Include ${!hasEmail ? 'email' : !hasPhone ? 'phone' : 'LinkedIn'} for professionalism.`
          : 'No contact info found. Add at least email and phone or LinkedIn.' 
      },
      {
        name: 'Skills',
        score: keywordScore,
        status: getScoreRange(keywordScore),
        feedback: keywordScore === 100
          ? `Impressive skill set with ${Object.values(skillCounts).filter(count => count > 0).length} categories (e.g., ${Object.entries(skillCounts).filter(([_, count]) => count > 0).slice(0, 2).map(([cat]) => cat).join(', ')}).`
          : keywordScore >= 90
          ? `Strong skills across ${Object.values(skillCounts).filter(count => count > 0).length} categories. Add expertise in ${Object.keys(technicalSkills).filter(cat => skillCounts[cat] === 0).slice(0, 2).join(', ')} or similar.`
          : keywordScore >= 80
          ? `Good skills in ${Object.values(skillCounts).filter(count => count > 0).length} categories. Include ${Object.keys(technicalSkills).filter(cat => skillCounts[cat] === 0).slice(0, 1)} or related skills.`
          : keywordScore >= 60
          ? `Moderate skills in ${Object.values(skillCounts).filter(count => count > 0).length} categories. Expand with ${Object.keys(technicalSkills).filter(cat => skillCounts[cat] === 0).slice(0, 2).join(', ')}.`
          : keywordScore >= 40
          ? `Limited skills in ${Object.values(skillCounts).filter(count => count > 0).length} category. Add ${Object.keys(technicalSkills).filter(cat => skillCounts[cat] === 0).slice(0, 2).join(', ')} for balance.`
          : 'No skills detected. Add at least 2 categories (e.g., programming, frameworks).'
      },
      {
        name: 'Work Experience',
        score: experienceScore,
        status: getScoreRange(experienceScore),
        feedback: experienceScore === 100
          ? `Outstanding ${experienceEntries} experiences totaling ${experienceDuration} months. Highlight measurable impacts.`
          : experienceScore >= 90
          ? `Solid ${experienceEntries} experiences with ${experienceDuration} months. Add 1 more role or detail impacts.`
          : experienceScore >= 80
          ? `Good ${experienceEntries} experience with ${experienceDuration} months. Include 1-2 more roles or responsibilities.`
          : experienceScore >= 60
          ? `Basic ${experienceEntries} experience with ${experienceDuration} months. Add 1-2 entries with dates and duties.`
          : experienceScore >= 40
          ? 'Minimal experience detected. Include 1-2 roles with timelines and tasks.'
          : 'No work experience found. Add internships or projects with dates.'
      },
      {
        name: 'Quantifiable Achievements',
        score: metricsScore,
        status: getScoreRange(metricsScore),
        feedback: metricsScore === 100
          ? `Exceptional ${quantifiableAchievementCount} achievements (e.g., ${quantifiableAchievements.slice(0, 1).join(', ')}). Showcase more for impact.`
          : metricsScore >= 90
          ? `Strong ${quantifiableAchievementCount} achievements (e.g., ${quantifiableAchievements.slice(0, 1).join(', ')}). Add 1-2 more with percentages.`
          : metricsScore >= 80
          ? `Good ${quantifiableAchievementCount} achievement (e.g., ${quantifiableAchievements.slice(0, 1).join(', ')}). Include 1-2 more metrics.`
          : metricsScore >= 70
          ? `Decent ${quantifiableAchievementCount} achievement detected. Add 1-2 quantifiable results (e.g., "increased by 20%").`
          : metricsScore >= 50
          ? 'Basic achievement found. Enhance with 1-2 specific metrics (e.g., "led 5 projects").'
          : 'No achievements detected. Add measurable outcomes (e.g., "improved efficiency by 30%").'
      }
    ];

    const result = {
      score: {
        overallScore,
        categories
      },
      summary: {
        wordCount,
        technicalSkillCount,
        presentSections,
        missingSections: requiredSections.filter(section => !presentSections.includes(section))
      }
    };

    console.log('Analysis result:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('Resume analysis error:', error.message);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};
