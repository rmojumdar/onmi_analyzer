import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import analyzeComponent from "@salesforce/apex/OmniAnalyzerController.analyzeComponent";

export default class OmniAnalyzer extends LightningElement {
  @track selectedComponentType = "OmniScript";
  @track metadata = "";
  @track isAnalyzing = false;
  @track showResults = false;
  @track documentationResult = "";
  @track auditResult = "";
  @track errorMessage = "";

  componentTypeOptions = [
    { label: "OmniScript", value: "OmniScript" },
    { label: "FlexCard", value: "FlexCard" },
    { label: "Integration Procedure", value: "IntegrationProcedure" },
    { label: "Data Mapper", value: "DataMapper" },
  ];

  handleComponentTypeChange(event) {
    this.selectedComponentType = event.detail.value;
  }

  handleMetadataChange(event) {
    this.metadata = event.detail.value;
  }

  async handleAnalyze() {
    if (!this.metadata || !this.metadata.trim()) {
      this.errorMessage =
        "Please paste the component XML metadata before analyzing.";
      return;
    }

    this.errorMessage = "";
    this.isAnalyzing = true;
    this.showResults = false;

    try {
      const [docResult, auditResult] = await Promise.all([
        analyzeComponent({
          componentType: this.selectedComponentType,
          metadata: this.metadata,
          analysisType: "documentation",
        }),
        analyzeComponent({
          componentType: this.selectedComponentType,
          metadata: this.metadata,
          analysisType: "bestpractice",
        }),
      ]);

      this.documentationResult = this.formatAsHtml(docResult);
      this.auditResult = this.formatAsHtml(auditResult);
      this.showResults = true;
    } catch (error) {
      this.errorMessage =
        error.body?.message ||
        error.message ||
        "Analysis failed. Please try again.";
    } finally {
      this.isAnalyzing = false;
    }
  }

  // Convert plain text with markdown-style formatting to basic HTML
  formatAsHtml(text) {
    if (!text) return "";
    const bold = (t) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const parts = [];
    let inList = false;

    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("- ") && inList) {
        parts.push("</ul>");
        inList = false;
      }
      if (t.startsWith("### ")) {
        parts.push("<p>&nbsp;</p>");
        parts.push(`<h3>${bold(t.slice(4))}</h3>`);
      } else if (t.startsWith("## ")) {
        parts.push("<p>&nbsp;</p>");
        parts.push(`<h2>${bold(t.slice(3))}</h2>`);
      } else if (t.startsWith("# ")) {
        parts.push("<p>&nbsp;</p>");
        parts.push(`<h1>${bold(t.slice(2))}</h1>`);
      } else if (t.startsWith("- ")) {
        if (!inList) {
          parts.push("<ul>");
          inList = true;
        }
        parts.push(`<li>${bold(t.slice(2))}</li>`);
      } else {
        parts.push(`<p>${bold(t)}</p>`);
      }
    }
    if (inList) parts.push("</ul>");
    return parts.join("");
  }

  handleCopyDocumentation() {
    this.copyToClipboard(
      this.stripHtml(this.documentationResult),
      "Documentation copied",
    );
  }

  handleCopyAudit() {
    this.copyToClipboard(
      this.stripHtml(this.auditResult),
      "Audit report copied",
    );
  }

  stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  copyToClipboard(text, successMessage) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Copied",
            message: successMessage,
            variant: "success",
          }),
        );
      })
      .catch(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Could not copy to clipboard",
            variant: "error",
          }),
        );
      });
  }
}
