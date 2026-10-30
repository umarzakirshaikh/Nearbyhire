// SVG Diagrams for Chapter 3 of NearbyHire Project Report

function getSystemFlowchartSvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#333"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- Title -->
    <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">NearbyHire - End-to-End System Flowchart</text>

    <!-- Start Node -->
    <rect x="230" y="55" width="140" height="36" rx="18" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
    <text x="300" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">Start / Launch App</text>
    <line x1="300" y1="91" x2="300" y2="120" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Decision: Role -->
    <polygon points="300,120 390,155 300,190 210,155" fill="#f8fafc" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="300" y="152" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Select User</text>
    <text x="300" y="166" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Persona?</text>

    <!-- Student Branch (Left) -->
    <line x1="210" y1="155" x2="140" y2="155" stroke="#333" stroke-width="1.5"/>
    <line x1="140" y1="155" x2="140" y2="215" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="165" y="145" font-size="11" font-weight="bold" fill="#059669">Student</text>

    <rect x="65" y="215" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="140" y="233" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Student Auth / Login</text>
    <text x="140" y="247" text-anchor="middle" font-size="10" fill="#64748b">Verify JWT Token</text>
    <line x1="140" y1="257" x2="140" y2="285" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="65" y="285" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="140" y="303" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Resolve GPS Location</text>
    <text x="140" y="317" text-anchor="middle" font-size="10" fill="#64748b">HTML5 Geolocation API</text>
    <line x1="140" y1="327" x2="140" y2="355" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="65" y="355" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="140" y="373" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Query Nearby Gigs</text>
    <text x="140" y="387" text-anchor="middle" font-size="10" fill="#64748b">MongoDB $nearSphere</text>
    <line x1="140" y1="397" x2="140" y2="425" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="65" y="425" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="140" y="443" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Apply for Shift</text>
    <text x="140" y="457" text-anchor="middle" font-size="10" fill="#64748b">Submit Profile &amp; Note</text>
    <line x1="140" y1="467" x2="140" y2="495" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Business Branch (Right) -->
    <line x1="390" y1="155" x2="460" y2="155" stroke="#333" stroke-width="1.5"/>
    <line x1="460" y1="155" x2="460" y2="215" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="405" y="145" font-size="11" font-weight="bold" fill="#2563eb">Business</text>

    <rect x="385" y="215" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="460" y="233" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Business Auth / Login</text>
    <text x="460" y="247" text-anchor="middle" font-size="10" fill="#64748b">Verify Business Profile</text>
    <line x1="460" y1="257" x2="460" y2="285" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="385" y="285" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="460" y="303" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Create Shift Posting</text>
    <text x="460" y="317" text-anchor="middle" font-size="10" fill="#64748b">Title, Category, ₹ Wage</text>
    <line x1="460" y1="327" x2="460" y2="355" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="385" y="355" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="460" y="373" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Set Urgent Flag?</text>
    <text x="460" y="387" text-anchor="middle" font-size="10" fill="#64748b">Broadcast Priority Alert</text>
    <line x1="460" y1="397" x2="460" y2="425" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="385" y="425" width="150" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="460" y="443" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Review Applicants</text>
    <text x="460" y="457" text-anchor="middle" font-size="10" fill="#64748b">Check Reliability Index</text>
    <line x1="460" y1="467" x2="460" y2="495" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Convergence: Application Acceptance -->
    <polygon points="300,495 390,530 300,565 210,530" fill="#f8fafc" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="300" y="526" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Candidate</text>
    <text x="300" y="540" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Accepted?</text>

    <line x1="140" y1="495" x2="140" y2="530" stroke="#333" stroke-width="1.5"/>
    <line x1="140" y1="530" x2="210" y2="530" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <line x1="460" y1="495" x2="460" y2="530" stroke="#333" stroke-width="1.5"/>
    <line x1="460" y1="530" x2="390" y2="530" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Accepted Flow -->
    <line x1="300" y1="565" x2="300" y2="595" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="315" y="583" font-size="11" font-weight="bold" fill="#059669">Yes</text>

    <rect x="215" y="595" width="170" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="613" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Real-Time Chat Coordination</text>
    <text x="300" y="627" text-anchor="middle" font-size="10" fill="#64748b">Socket.IO Room Messaging</text>
    <line x1="300" y1="637" x2="300" y2="665" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <rect x="215" y="665" width="170" height="42" rx="6" fill="#fff" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="683" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Complete Shift &amp; Disburse Pay</text>
    <text x="300" y="697" text-anchor="middle" font-size="10" fill="#64748b">₹ INR Virtual Wallet Credit</text>
    <line x1="300" y1="707" x2="300" y2="735" stroke="#333" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- End Node -->
    <rect x="230" y="735" width="140" height="36" rx="18" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
    <text x="300" y="758" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">End / Shift Settled</text>
  </svg>
  `;
}

function getUseCaseSvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid2)" />

    <!-- Boundary Box -->
    <rect x="150" y="60" width="300" height="690" rx="10" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    <text x="300" y="90" text-anchor="middle" font-size="15" font-weight="bold" fill="#0f172a">NearbyHire Platform</text>

    <!-- Student Actor (Left) -->
    <!-- Head -->
    <circle cx="70" cy="360" r="18" fill="#fff" stroke="#1e293b" stroke-width="2"/>
    <!-- Body -->
    <line x1="70" y1="378" x2="70" y2="430" stroke="#1e293b" stroke-width="2"/>
    <!-- Arms -->
    <line x1="40" y1="395" x2="100" y2="395" stroke="#1e293b" stroke-width="2"/>
    <!-- Legs -->
    <line x1="70" y1="430" x2="45" y2="475" stroke="#1e293b" stroke-width="2"/>
    <line x1="70" y1="430" x2="95" y2="475" stroke="#1e293b" stroke-width="2"/>
    <text x="70" y="505" text-anchor="middle" font-size="13" font-weight="bold" fill="#059669">Student</text>

    <!-- Business Actor (Right) -->
    <!-- Head -->
    <circle cx="530" cy="360" r="18" fill="#fff" stroke="#1e293b" stroke-width="2"/>
    <!-- Body -->
    <line x1="530" y1="378" x2="530" y2="430" stroke="#1e293b" stroke-width="2"/>
    <!-- Arms -->
    <line x1="500" y1="395" x2="560" y2="395" stroke="#1e293b" stroke-width="2"/>
    <!-- Legs -->
    <line x1="530" y1="430" x2="505" y2="475" stroke="#1e293b" stroke-width="2"/>
    <line x1="530" y1="430" x2="555" y2="475" stroke="#1e293b" stroke-width="2"/>
    <text x="530" y="505" text-anchor="middle" font-size="13" font-weight="bold" fill="#2563eb">Business Owner</text>

    <!-- Use Cases (Ovals) -->
    <!-- 1. Auth -->
    <ellipse cx="300" cy="130" rx="100" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Register &amp; Login (JWT)</text>
    <line x1="70" y1="360" x2="200" y2="135" stroke="#64748b" stroke-width="1.2"/>
    <line x1="530" y1="360" x2="400" y2="135" stroke="#64748b" stroke-width="1.2"/>

    <!-- 2. Search Nearby -->
    <ellipse cx="300" cy="195" rx="110" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Search Nearby Gigs (&lt;2km, 5km)</text>
    <line x1="70" y1="360" x2="190" y2="200" stroke="#64748b" stroke-width="1.2"/>

    <!-- 3. Apply -->
    <ellipse cx="300" cy="260" rx="100" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="265" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Apply for Shift with Note</text>
    <line x1="70" y1="360" x2="200" y2="265" stroke="#64748b" stroke-width="1.2"/>

    <!-- 4. Post Gigs -->
    <ellipse cx="300" cy="325" rx="105" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="330" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Post Shift Openings &amp; ₹ Wage</text>
    <line x1="530" y1="360" x2="405" y2="330" stroke="#64748b" stroke-width="1.2"/>

    <!-- 5. Urgent Hiring -->
    <ellipse cx="300" cy="390" rx="100" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="395" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Flag Urgent Hiring Posts</text>
    <line x1="530" y1="360" x2="400" y2="390" stroke="#64748b" stroke-width="1.2"/>

    <!-- 6. Review Applicants -->
    <ellipse cx="300" cy="455" rx="110" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="460" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Review Reliability &amp; Accept</text>
    <line x1="530" y1="360" x2="410" y2="455" stroke="#64748b" stroke-width="1.2"/>

    <!-- 7. Real Time Chat -->
    <ellipse cx="300" cy="520" rx="100" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="525" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Live Chat via Socket.IO</text>
    <line x1="70" y1="360" x2="200" y2="520" stroke="#64748b" stroke-width="1.2"/>
    <line x1="530" y1="360" x2="400" y2="520" stroke="#64748b" stroke-width="1.2"/>

    <!-- 8. Complete & Disburse Pay -->
    <ellipse cx="300" cy="585" rx="105" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="590" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Complete Shift &amp; Disburse Pay</text>
    <line x1="530" y1="360" x2="405" y2="585" stroke="#64748b" stroke-width="1.2"/>

    <!-- 9. Manage Wallet -->
    <ellipse cx="300" cy="650" rx="110" ry="24" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="655" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">View Wallet &amp; Withdraw UPI</text>
    <line x1="70" y1="360" x2="190" y2="650" stroke="#64748b" stroke-width="1.2"/>

    <!-- 10. Rating & Reviews -->
    <ellipse cx="300" cy="710" rx="100" ry="22" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="300" y="715" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">Submit Ratings &amp; Feedback</text>
    <line x1="530" y1="360" x2="400" y2="710" stroke="#64748b" stroke-width="1.2"/>
  </svg>
  `;
}

function getActivitySvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
      <marker id="arrow3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#333"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid3)" />

    <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">NearbyHire - Core Activity Diagram</text>

    <!-- Start Node -->
    <circle cx="300" cy="65" r="12" fill="#0f172a"/>
    <line x1="300" y1="77" x2="300" y2="105" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Action 1 -->
    <rect x="200" y="105" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="129" text-anchor="middle" font-size="11" font-weight="600">Business Posts Shift Vacancy</text>
    <line x1="300" y1="143" x2="300" y2="175" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Action 2 -->
    <rect x="200" y="175" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="199" text-anchor="middle" font-size="11" font-weight="600">Index Location (2dsphere)</text>
    <line x1="300" y1="213" x2="300" y2="245" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Action 3 -->
    <rect x="200" y="245" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="269" text-anchor="middle" font-size="11" font-weight="600">Student Discovers Nearby Gigs</text>
    <line x1="300" y1="283" x2="300" y2="315" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Action 4 -->
    <rect x="200" y="315" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="339" text-anchor="middle" font-size="11" font-weight="600">Student Submits Application</text>
    <line x1="300" y1="353" x2="300" y2="385" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Decision: Accept Candidate -->
    <polygon points="300,385 380,415 300,445 220,415" fill="#f8fafc" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="300" y="412" text-anchor="middle" font-size="10" font-weight="bold">Employer</text>
    <text x="300" y="424" text-anchor="middle" font-size="10" font-weight="bold">Accepts?</text>

    <!-- Branch No -->
    <line x1="220" y1="415" x2="130" y2="415" stroke="#333" stroke-width="1.5"/>
    <line x1="130" y1="415" x2="130" y2="470" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>
    <text x="165" y="408" font-size="11" font-weight="bold" fill="#ef4444">No</text>
    <rect x="50" y="470" width="160" height="36" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
    <text x="130" y="492" text-anchor="middle" font-size="10" fill="#991b1b">Notify Rejection Status</text>

    <!-- Branch Yes -->
    <line x1="300" y1="445" x2="300" y2="475" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>
    <text x="315" y="462" font-size="11" font-weight="bold" fill="#10b981">Yes</text>

    <rect x="200" y="475" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="499" text-anchor="middle" font-size="11" font-weight="600">Activate Socket.IO Chat Room</text>
    <line x1="300" y1="513" x2="300" y2="545" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <rect x="200" y="545" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="569" text-anchor="middle" font-size="11" font-weight="600">Student Completes Shift</text>
    <line x1="300" y1="583" x2="300" y2="615" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <rect x="200" y="615" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="639" text-anchor="middle" font-size="11" font-weight="600">Release ₹ Pay to Student Wallet</text>
    <line x1="300" y1="653" x2="300" y2="685" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <rect x="200" y="685" width="200" height="38" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="709" text-anchor="middle" font-size="11" font-weight="600">Update Reliability &amp; Review</text>
    <line x1="300" y1="723" x2="300" y2="745" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Merge Rejection back to end -->
    <line x1="130" y1="506" x2="130" y2="755" stroke="#333" stroke-width="1.5"/>
    <line x1="130" y1="755" x2="285" y2="755" stroke="#333" stroke-width="1.5" marker-end="url(#arrow3)"/>

    <!-- Final Node -->
    <circle cx="300" cy="755" r="14" fill="#fff" stroke="#0f172a" stroke-width="2"/>
    <circle cx="300" cy="755" r="9" fill="#0f172a"/>
  </svg>
  `;
}

function getClassDiagramSvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid4)" />

    <text x="300" y="25" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e293b">NearbyHire - Entity Class Diagram (Mongoose Schemas)</text>

    <!-- User Class -->
    <g transform="translate(30, 45)">
      <rect width="250" height="175" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">User</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ name: String</text>
      <text x="8" y="72" font-size="9.5">+ email: String (unique)</text>
      <text x="8" y="86" font-size="9.5">+ password: String (bcrypt)</text>
      <text x="8" y="100" font-size="9.5">+ role: 'STUDENT' | 'BUSINESS'</text>
      <text x="8" y="114" font-size="9.5">+ phone: String</text>
      <text x="8" y="128" font-size="9.5">+ skills: String[]</text>
      <text x="8" y="142" font-size="9.5">+ rating: Number [1.0 - 5.0]</text>
      <text x="8" y="156" font-size="9.5">+ reliabilityScore: Number [0-100]</text>
      <line x1="0" y1="160" x2="250" y2="160" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="172" font-size="9.5">+ matchPassword(), generateToken()</text>
    </g>

    <!-- BusinessProfile Class -->
    <g transform="translate(320, 45)">
      <rect width="250" height="175" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">BusinessProfile</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ user: ObjectId (ref User)</text>
      <text x="8" y="72" font-size="9.5">+ companyName: String</text>
      <text x="8" y="86" font-size="9.5">+ industryCategory: String</text>
      <text x="8" y="100" font-size="9.5">+ address: String</text>
      <text x="8" y="114" font-size="9.5">+ city: String</text>
      <text x="8" y="128" font-size="9.5">+ location: GeoJSON Point [lng, lat]</text>
      <text x="8" y="142" font-size="9.5">+ contactPhone: String</text>
      <text x="8" y="156" font-size="9.5">+ isVerified: Boolean</text>
      <line x1="0" y1="160" x2="250" y2="160" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="172" font-size="9.5">+ updateCoordinates()</text>
    </g>

    <!-- Job Class -->
    <g transform="translate(320, 260)">
      <rect width="250" height="190" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">Job (Gig Posting)</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ business: ObjectId (ref Business)</text>
      <text x="8" y="72" font-size="9.5">+ title: String</text>
      <text x="8" y="86" font-size="9.5">+ category: String</text>
      <text x="8" y="100" font-size="9.5">+ isUrgent: Boolean (default: false)</text>
      <text x="8" y="114" font-size="9.5">+ wage: { amount: ₹, rateType, curr }</text>
      <text x="8" y="128" font-size="9.5">+ location: Point [lng, lat] (2dsphere)</text>
      <text x="8" y="142" font-size="9.5">+ shiftTiming: String</text>
      <text x="8" y="156" font-size="9.5">+ status: 'OPEN' | 'FILLED'</text>
      <line x1="0" y1="168" x2="250" y2="168" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="182" font-size="9.5">+ findNearby($nearSphere, maxDist)</text>
    </g>

    <!-- Application Class -->
    <g transform="translate(30, 260)">
      <rect width="250" height="190" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">Application</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ job: ObjectId (ref Job)</text>
      <text x="8" y="72" font-size="9.5">+ student: ObjectId (ref User)</text>
      <text x="8" y="86" font-size="9.5">+ employer: ObjectId (ref User)</text>
      <text x="8" y="100" font-size="9.5">+ status: 'APPLIED'|'ACCEPTED'|...</text>
      <text x="8" y="114" font-size="9.5">+ coverNote: String</text>
      <text x="8" y="128" font-size="9.5">+ ratingGiven: Number</text>
      <text x="8" y="142" font-size="9.5">+ reviewText: String</text>
      <text x="8" y="156" font-size="9.5">+ completedAt: Date</text>
      <line x1="0" y1="168" x2="250" y2="168" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="182" font-size="9.5">+ updateStatus(), submitReview()</text>
    </g>

    <!-- Wallet Class -->
    <g transform="translate(30, 485)">
      <rect width="250" height="145" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">Wallet (₹ INR)</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ student: ObjectId (ref User)</text>
      <text x="8" y="72" font-size="9.5">+ balance: Number (₹ INR)</text>
      <text x="8" y="86" font-size="9.5">+ totalEarnings: Number (₹)</text>
      <text x="8" y="100" font-size="9.5">+ payoutDetails: { upiId, bankAcc }</text>
      <line x1="0" y1="112" x2="250" y2="112" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="126" font-size="9.5">+ creditShiftPay(₹), withdrawUPI()</text>
    </g>

    <!-- Transaction Class -->
    <g transform="translate(320, 485)">
      <rect width="250" height="145" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="28" fill="#e2e8f0"/>
      <text x="125" y="19" text-anchor="middle" font-size="12" font-weight="bold">Transaction</text>
      <line x1="0" y1="28" x2="250" y2="28" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="44" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="58" font-size="9.5">+ wallet: ObjectId (ref Wallet)</text>
      <text x="8" y="72" font-size="9.5">+ amount: Number (₹ INR)</text>
      <text x="8" y="86" font-size="9.5">+ type: 'EARNING' | 'PAYOUT'</text>
      <text x="8" y="100" font-size="9.5">+ status: 'COMPLETED'|'PENDING'</text>
      <line x1="0" y1="112" x2="250" y2="112" stroke="#cbd5e1" stroke-width="1"/>
      <text x="8" y="126" font-size="9.5">+ logAuditEntry()</text>
    </g>

    <!-- Message Class -->
    <g transform="translate(175, 650)">
      <rect width="250" height="115" fill="#fff" stroke="#334155" stroke-width="1.5"/>
      <rect width="250" height="26" fill="#e2e8f0"/>
      <text x="125" y="18" text-anchor="middle" font-size="12" font-weight="bold">Message (Socket.IO)</text>
      <line x1="0" y1="26" x2="250" y2="26" stroke="#334155" stroke-width="1.5"/>
      <text x="8" y="42" font-size="9.5">+ _id: ObjectId</text>
      <text x="8" y="56" font-size="9.5">+ application: ObjectId (ref App)</text>
      <text x="8" y="70" font-size="9.5">+ sender / recipient: ObjectId</text>
      <text x="8" y="84" font-size="9.5">+ text: String, isRead: Boolean</text>
      <text x="8" y="98" font-size="9.5">+ createdAt: Timestamp</text>
    </g>

    <!-- Association Lines -->
    <line x1="280" y1="130" x2="320" y2="130" stroke="#334155" stroke-width="1.5"/>
    <text x="288" y="122" font-size="9">1</text>
    <text x="306" y="122" font-size="9">1</text>

    <line x1="445" y1="220" x2="445" y2="260" stroke="#334155" stroke-width="1.5"/>
    <text x="450" y="235" font-size="9">1</text>
    <text x="450" y="255" font-size="9">N</text>

    <line x1="280" y1="355" x2="320" y2="355" stroke="#334155" stroke-width="1.5"/>
    <text x="288" y="347" font-size="9">N</text>
    <text x="306" y="347" font-size="9">1</text>

    <line x1="155" y1="220" x2="155" y2="260" stroke="#334155" stroke-width="1.5"/>
    <text x="160" y="235" font-size="9">1</text>
    <text x="160" y="255" font-size="9">N</text>

    <line x1="155" y1="450" x2="155" y2="485" stroke="#334155" stroke-width="1.5"/>
    <line x1="280" y1="550" x2="320" y2="550" stroke="#334155" stroke-width="1.5"/>
  </svg>
  `;
}

function getSequenceSvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid5" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
      <marker id="arrow5" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#333"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid5)" />

    <text x="300" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e293b">NearbyHire - Core Job Matching &amp; Payout Sequence</text>

    <!-- Actors / Entities -->
    <rect x="20" y="55" width="85" height="34" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
    <text x="62" y="76" text-anchor="middle" font-size="11" font-weight="bold">Student</text>
    <line x1="62" y1="89" x2="62" y2="740" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

    <rect x="130" y="55" width="95" height="34" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
    <text x="177" y="76" text-anchor="middle" font-size="11" font-weight="bold">React UI</text>
    <line x1="177" y1="89" x2="177" y2="740" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

    <rect x="250" y="55" width="100" height="34" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
    <text x="300" y="76" text-anchor="middle" font-size="11" font-weight="bold">Express API</text>
    <line x1="300" y1="89" x2="300" y2="740" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

    <rect x="375" y="55" width="95" height="34" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
    <text x="422" y="76" text-anchor="middle" font-size="11" font-weight="bold">Socket.IO</text>
    <line x1="422" y1="89" x2="422" y2="740" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

    <rect x="495" y="55" width="85" height="34" rx="5" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
    <text x="537" y="76" text-anchor="middle" font-size="11" font-weight="bold">MongoDB</text>
    <line x1="537" y1="89" x2="537" y2="740" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

    <!-- Step 1: Open Feed & Query Nearby -->
    <line x1="62" y1="120" x2="177" y2="120" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="120" y="113" text-anchor="middle" font-size="9.5">Select Radius (&lt; 2km)</text>

    <line x1="177" y1="150" x2="300" y2="150" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="238" y="143" text-anchor="middle" font-size="9.5">GET /jobs/nearby?lng&amp;lat</text>

    <line x1="300" y1="180" x2="537" y2="180" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="418" y="173" text-anchor="middle" font-size="9.5">Query $nearSphere(Point, 2000m)</text>

    <line x1="537" y1="210" x2="300" y2="210" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arrow5)"/>
    <text x="418" y="203" text-anchor="middle" font-size="9.5">Return Indexed Jobs Array</text>

    <line x1="300" y1="240" x2="177" y2="240" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arrow5)"/>
    <text x="238" y="233" text-anchor="middle" font-size="9.5">Render Nearby Feed + ₹ Wage</text>

    <!-- Step 2: Apply -->
    <line x1="62" y1="280" x2="177" y2="280" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="120" y="273" text-anchor="middle" font-size="9.5">Click "Apply Now" + Cover Note</text>

    <line x1="177" y1="310" x2="300" y2="310" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="238" y="303" text-anchor="middle" font-size="9.5">POST /applications/:id/apply</text>

    <line x1="300" y1="340" x2="537" y2="340" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="418" y="333" text-anchor="middle" font-size="9.5">Save Application (status: APPLIED)</text>

    <line x1="300" y1="370" x2="422" y2="370" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="361" y="363" text-anchor="middle" font-size="9.5">emit('new_applicant')</text>

    <!-- Step 3: Accept & Real-Time Chat -->
    <line x1="422" y1="410" x2="177" y2="410" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arrow5)"/>
    <text x="300" y="403" text-anchor="middle" font-size="9.5">Broadcast Candidate Accepted Alert</text>

    <line x1="62" y1="450" x2="422" y2="450" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="242" y="443" text-anchor="middle" font-size="9.5">emit('send_message', text)</text>

    <line x1="422" y1="480" x2="537" y2="480" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="480" y="473" text-anchor="middle" font-size="9.5">Store Message in DB</text>

    <line x1="422" y1="510" x2="177" y2="510" stroke="#64748b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="300" y="503" text-anchor="middle" font-size="9.5">broadcast('receive_message')</text>

    <!-- Step 4: Shift Completion & ₹ Wallet Credit -->
    <line x1="177" y1="560" x2="300" y2="560" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="238" y="553" text-anchor="middle" font-size="9.5">PATCH /applications/:id/status (COMPLETED)</text>

    <line x1="300" y1="600" x2="537" y2="600" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="418" y="593" text-anchor="middle" font-size="9.5">Atomic $inc: { balance: ₹650 }</text>

    <line x1="537" y1="630" x2="300" y2="630" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arrow5)"/>
    <text x="418" y="623" text-anchor="middle" font-size="9.5">Wallet Balance &amp; Transaction Logged</text>

    <line x1="300" y1="670" x2="177" y2="670" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" marker-end="url(#arrow5)"/>
    <text x="238" y="663" text-anchor="middle" font-size="9.5">Update Student UI: ₹1,850 Balance</text>

    <line x1="177" y1="700" x2="62" y2="700" stroke="#1e293b" stroke-width="1.2" marker-end="url(#arrow5)"/>
    <text x="120" y="693" text-anchor="middle" font-size="9.5">Display Instant Payout Verified</text>
  </svg>
  `;
}

function getGanttChartSvg() {
  return `
  <svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border:1px solid #ccc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <defs>
      <pattern id="grid6" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid6)" />

    <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">NearbyHire - Project Development Gantt Chart</text>
    <text x="300" y="55" text-anchor="middle" font-size="11" fill="#64748b">Academic Year 2024–2025 Implementation Timeline</text>

    <!-- Timeline Header -->
    <g transform="translate(180, 80)">
      <line x1="0" y1="0" x2="390" y2="0" stroke="#cbd5e1" stroke-width="1"/>
      <line x1="0" y1="0" x2="0" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="65" y1="0" x2="65" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="130" y1="0" x2="130" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="195" y1="0" x2="195" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="260" y1="0" x2="260" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="325" y1="0" x2="325" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="390" y1="0" x2="390" y2="620" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>

      <text x="0" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">01-07-2024</text>
      <text x="65" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">20-07-2024</text>
      <text x="130" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">10-08-2024</text>
      <text x="195" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">30-08-2024</text>
      <text x="260" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">18-09-2024</text>
      <text x="325" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">05-10-2024</text>
      <text x="390" y="-8" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569">28-10-2024</text>
    </g>

    <!-- Task Rows (matching original orange style!) -->
    <!-- 1. Project Initiation -->
    <text x="165" y="125" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Project Initiation</text>
    <rect x="180" y="112" width="55" height="18" rx="3" fill="#f97316"/>

    <!-- 2. Planning & Design -->
    <text x="165" y="185" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Planning &amp; Architecture</text>
    <rect x="230" y="172" width="65" height="18" rx="3" fill="#f97316"/>

    <!-- 3. Develop Frontend -->
    <text x="165" y="245" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Frontend Development</text>
    <rect x="285" y="232" width="75" height="18" rx="3" fill="#f97316"/>

    <!-- 4. Backend Development -->
    <text x="165" y="305" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Backend REST APIs</text>
    <rect x="345" y="292" width="85" height="18" rx="3" fill="#f97316"/>

    <!-- 5. Geospatial & Socket.IO -->
    <text x="165" y="365" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Geospatial &amp; Socket.IO</text>
    <rect x="410" y="352" width="65" height="18" rx="3" fill="#f97316"/>

    <!-- 6. Virtual Wallet & INR Payout -->
    <text x="165" y="425" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Wallet &amp; Payout Engine</text>
    <rect x="465" y="412" width="45" height="18" rx="3" fill="#f97316"/>

    <!-- 7. Testing & Quality Assurance -->
    <text x="165" y="485" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Testing &amp; Security Audit</text>
    <rect x="500" y="472" width="45" height="18" rx="3" fill="#f97316"/>

    <!-- 8. Deployment & Documentation -->
    <text x="165" y="545" text-anchor="end" font-size="10.5" font-weight="600" fill="#1e293b">Deployment &amp; Reporting</text>
    <rect x="535" y="532" width="35" height="18" rx="3" fill="#f97316"/>
  </svg>
  `;
}

module.exports = {
  getSystemFlowchartSvg,
  getUseCaseSvg,
  getActivitySvg,
  getClassDiagramSvg,
  getSequenceSvg,
  getGanttChartSvg
};
