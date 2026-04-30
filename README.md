# OmniStudio Component Analyzer

A Salesforce Lightning Web Component that uses Einstein AI (Prompt Builder) to generate technical documentation and best practice audits for OmniStudio components.

## Features

- **Documentation Generation** — Produces structured technical docs including overview, inputs/outputs, dependencies, field mappings, and flow summary
- **Best Practice Audit** — Scores components across performance, error handling, naming conventions, maintainability, and security with prioritized recommendations
- **Supports all major OmniStudio component types:**
  - OmniScript
  - FlexCard
  - Integration Procedure
  - DataMapper

## Architecture

| Layer | Technology |
|---|---|
| UI | Lightning Web Component (`omniAnalyzer`) |
| Backend | Apex (`OmniAnalyzerController`) |
| AI | Einstein Prompt Builder (`ConnectApi.EinsteinLLM`) |
| Models | GPT-4o Mini (`sfdc_ai__DefaultOpenAIGPT4OmniMini`) |

## Prerequisites

- Salesforce org with **Einstein Generative AI** enabled
- **OmniStudio** installed
- API version 63.0+

## Deployment

```bash
sf project deploy start --source-dir force-app/main/default/classes
sf project deploy start --source-dir force-app/main/default/lwc
sf project deploy start --source-dir force-app/main/default/genAiPromptTemplates
sf project deploy start --source-dir force-app/main/default/flexipages
```

Or deploy all at once:

```bash
sf project deploy start --source-dir force-app
```

## Setup

1. Deploy the metadata to your org
2. Activate both prompt templates in **Setup → Prompt Builder**:
   - `OmniAnalyzer_Documentation`
   - `OmniAnalyzer_BestPractice`
3. Add the **OmniStudio Component Analyzer** LWC to any App, Record, or Home page via Lightning App Builder

## Usage

1. Select the component type from the dropdown
2. Paste the component's XML metadata into the text area
3. Click **Analyze** — documentation and audit results are generated in parallel
4. Use the **Copy** buttons to export results

## Project Structure

```
force-app/main/default/
├── classes/
│   ├── OmniAnalyzerController.cls
│   └── OmniAnalyzerController_Test.cls
├── genAiPromptTemplates/
│   ├── OmniAnalyzer_Documentation.genAiPromptTemplate-meta.xml
│   └── OmniAnalyzer_BestPractice.genAiPromptTemplate-meta.xml
├── lwc/
│   └── omniAnalyzer/
│       ├── omniAnalyzer.html
│       ├── omniAnalyzer.js
│       ├── omniAnalyzer.css
│       └── omniAnalyzer.js-meta.xml
└── flexipages/
    └── Omni_Analyzer.flexipage-meta.xml
```
