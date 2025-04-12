**Product Requirements Document: TariffSmart v2 \- Educational MVP**

* **Author:** PM Builder (AI Assistant)  
* **Date Created:** April 12, 2025  
* **Last Updated:** April 12, 2025  
* **Version:** 2.0 MVP  
* **Status:** Draft

**1\. Introduction / Overview**  
This document outlines the requirements for the Minimum Viable Product (MVP) of **TariffSmart v2**. Following a strategic pivot away from the v1 features focused on real-time tariff tracking, TariffSmart v2 aims to empower consumers with foundational knowledge about international trade and tariffs through engaging, interactive educational features. This MVP focuses on validating the pivoted strategy by launching core educational tools that require low data maintenance. It includes two key features: an interactive module for learning concepts and simulating impacts, and a gamified reference tool for key terms and agreements.  
**2\. Goals & Objectives**  
(Aligned with the Product Strategy Document for the v2 Pivot)

* **Goal 1: Establish Foundational Understanding:** Users demonstrate comprehension of basic trade concepts via the new v2 features.  
* **Goal 2: Drive User Engagement:** Users actively interact with the new v2 educational features.  
* **Goal 3: Validate Pivot Viability:** Gather positive user feedback on the v2 educational focus and validate the market need for this new direction.

**3\. Target Audience / User Personas**

* **Primary User:** Everyday US consumers curious or concerned about economics, trade, and their financial impact, but potentially confused by the complexity or lacking formal economic training. They use mobile apps for learning and information gathering. (Consistent with original user base but served with a new educational focus).  
* **Secondary User (Potential):** Students (High School, College), small business owners seeking basic trade landscape understanding.

**4\. Use Cases / User Stories**

* **Feature 1: Interactive Trade Simulators & Concepts (v2 Core Feature)**  
  * UC-01: As a curious user, I want to complete short, interactive modules on topics like "What is a Tariff?" or "Why do countries trade?" so that I can understand core concepts in this new version of the app.  
  * UC-02: As a user wanting to test my knowledge, I want to take simple quizzes (e.g., multiple choice, true/false) after learning a concept so that I can check my understanding.  
  * UC-03: As a practical learner, I want to engage with mini-simulations (e.g., "If a 10% tariff is added to imported shoes, how might the price change?") so that I can see potential impacts visually.  
  * UC-04: As someone confused by news, I want to tackle common misconceptions via a "Myth vs. Fact" quiz format within the modules so that I can better evaluate claims I hear.  
  * UC-05: As a user progressing through content, I want to see my progress visually (e.g., completed modules) so that I feel a sense of accomplishment.  
* **Feature 2: Gamified Trade Reference (Dictionary/Explorer) (v2 Core Feature)**  
  * UC-06: As a user encountering an unfamiliar term (e.g., "Quota") in a module or news, I want to quickly look up its definition in a simple dictionary within the app so that I can understand the context.  
  * UC-07: As a user wanting a basic overview, I want to read simplified summaries of major trade principles or agreements (e.g., WTO basics, Free Trade vs. Protectionism) in an "Explorer" section so that I grasp the bigger picture.  
  * UC-08: As a user motivated by challenges, I want to participate in simple gamified activities within the reference section (e.g., match term to definition, daily term quiz) so that learning reference material is more engaging.  
  * UC-09: As a user exploring the reference, I want clear navigation (e.g., alphabetical listing, search, categories) so that I can find information easily.

**5\. Functional Requirements**

* **Feature 1: Interactive Trade Simulators & Concepts**  
  * REQ-01: The system shall present a library of distinct learning modules covering core trade/tariff concepts (MVP scope: 5-7 initial modules).  
  * REQ-02: Modules shall contain a mix of concise text explanations, simple visuals/infographics, and interactive elements.  
  * REQ-03: Interactive elements must include:  
    * REQ-03a: Simple quizzes (e.g., multiple-choice, true/false) integrated within or at the end of modules.  
    * REQ-03b: At least one type of mini-simulation or interactive exercise per module (e.g., basic impact calculation, drag-and-drop concept matching).  
    * REQ-03c: A dedicated "Myth vs. Fact" quiz section or integration within relevant modules.  
  * REQ-04: The system shall track and visually display user progress through the modules (e.g., checkmarks, progress bar).  
  * REQ-05: The system must provide feedback on quiz/interaction performance (correct/incorrect, brief explanation).  
* **Feature 2: Gamified Trade Reference (Dictionary/Explorer)**  
  * REQ-06: The system shall provide a searchable, browsable dictionary of key trade terms (MVP scope: 30-50 essential terms) with clear, concise definitions.  
  * REQ-07: The system shall provide simplified summaries of 3-5 major trade agreements or governing principles.  
  * REQ-08: The system must include at least one light gamification mechanic tied to the reference content (e.g., daily definition quiz, points for looking up terms, simple progress tracking for terms viewed).  
  * REQ-09: Navigation for the reference section must be intuitive (e.g., A-Z list, search bar).  
* **General MVP Requirements (v2)**  
  * REQ-10: Both new v2 features shall be clearly accessible, potentially replacing or alongside deprecated v1 features based on final UX decisions.  
  * REQ-11: All content (text, quiz questions/answers, definitions, summaries) must be manageable via a simple CMS or configuration files, allowing for infrequent updates without requiring a new app build.  
  * REQ-12: Basic user analytics (module starts/completions, quiz scores, feature usage frequency, term lookups) shall be tracked (e.g., via Google Analytics) to measure v2 goals.

**6\. Non-Functional Requirements**

* **Data Management:** All v2 feature content is static or requires only infrequent updates via CMS/config files. **No** real-time external data feeds for these new features.  
* **Performance:** UI interactions must be smooth and responsive. Content loading should be fast (\< 2 seconds).  
* **Usability:** Interface must be intuitive for non-expert users. Language used must be clear and simple.  
* **Accessibility:** Adhere to WCAG 2.1 Level AA guidelines.  
* **Platform:** iOS and Android native apps (consistent with v1).

**7\. Design / UX Considerations**

* Consider how to integrate or transition users from v1 features (if any remain) to the new v2 educational focus.  
* Maintain existing TariffSmart branding (if applicable) or refresh slightly for v2 while ensuring a trustworthy and engaging visual identity.  
* Use visuals (icons, simple illustrations, charts) effectively to aid understanding.  
* Ensure interactive elements are intuitive and touch-friendly.  
* Gamification should feel encouraging, not intrusive or overly complex for the MVP.  
* Provide clear navigation for the new v2 features.  
* *Link to Wireframes/Mockups:* \[Placeholder for Figma/design files link for v2\]

**8\. Release Criteria (MVP for v2)**

* All functional requirements (REQ-01 to REQ-12) for the v2 MVP features are implemented and pass QA testing.  
* Initial content for modules (5-7), dictionary terms (30-50), and explorer summaries (3-5) is finalized, reviewed for accuracy, and loaded.  
* Analytics tracking for v2 success metrics is implemented and verified.  
* Accessibility checks passed (WCAG 2.1 AA).  
* No critical or major bugs in the new v2 MVP features.  
* App performance meets defined non-functional requirements.  
* Plan for handling or messaging around deprecated v1 features is finalized.

**9\. Success Metrics (for v2 MVP)**  
(Aligned with MVP Goals & Product Strategy Document)

* **Understanding:** Average quiz scores (\>75%), Module completion rates (\>50% for users who start).  
* **Engagement:** Feature adoption rate (\>20% of monthly active users engaging with v2 features), Session duration increase (\>15% for users engaging with v2 features), Reference term lookup frequency, Gamified challenge completion rate (\>30%).  
* **Validation:** Qualitative feedback sentiment (target: \>70% positive/neutral towards v2 features), App Store rating (maintain or increase post v2 launch).

**10\. Open Issues / Questions**

* Finalize the specific list of MVP module topics, dictionary terms, and explorer summaries.  
* Define the exact gamification mechanics for the reference section.  
* Confirm technical approach for CMS/content management.  
* Confirm analytics event implementation details for v2 features.  
* **Determine strategy for sunsetting/integrating v1 features.**

**11\. Future Considerations / Out of Scope (for v2 MVP)**

* **From v2 Ideation:** Product Journey Visualizer, Trade Policy Decision Scenarios, Curated Impact Stories & Case Studies.  
* User accounts / saving progress across devices (unless critical for basic progress tracking and already exists from v1).  
* Advanced gamification (leaderboards, badges).  
* Social sharing features.  
* User-generated content or community features.  
* Monetization features (ads, subscriptions) \- deferred post-MVP validation.  
* Personalized content recommendations.  
* Deeper integration between dictionary terms and simulator content.  
* **Any remaining v1 features requiring high-maintenance data (e.g., real-time price prediction, detailed alternative finders) are explicitly out of scope for v2 development.**

---

