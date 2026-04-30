public with sharing class OmniAnalyzerController {

    @AuraEnabled
    public static String analyzeComponent(String componentType, String metadata, String analysisType) {
        try {
            String promptTemplateName = analysisType == 'documentation'
                ? 'OmniAnalyzer_Documentation'
                : 'OmniAnalyzer_BestPractice';

            ConnectApi.EinsteinPromptTemplateGenerationsInput input =
                new ConnectApi.EinsteinPromptTemplateGenerationsInput();
            input.isPreview = false;

            ConnectApi.WrappedValue componentTypeVal = new ConnectApi.WrappedValue();
            componentTypeVal.value = componentType;

            ConnectApi.WrappedValue metadataVal = new ConnectApi.WrappedValue();
            metadataVal.value = metadata;

            input.inputParams = new Map<String, ConnectApi.WrappedValue>{
                'Input:componentType' => componentTypeVal,
                'Input:metadata' => metadataVal
            };

            input.additionalConfig = new ConnectApi.EinsteinLlmAdditionalConfigInput();
            input.additionalConfig.applicationName = 'PromptTemplateGenerationsInvocable';

            ConnectApi.EinsteinPromptTemplateGenerationsRepresentation result =
                ConnectApi.EinsteinLLM.generateMessagesForPromptTemplate(promptTemplateName, input);

            return result.generations[0].text;

        } catch (Exception e) {
            throw new AuraHandledException('Analysis failed: ' + e.getMessage());
        }
    }
}
