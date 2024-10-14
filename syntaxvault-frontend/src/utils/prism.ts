// src/prism.ts
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// Import the languages you want to support
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';

import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
// Add more languages as needed
// Example: import 'prismjs/components/prism-swift';

export default Prism;