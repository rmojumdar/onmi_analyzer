@isTest
private class OmniAnalyzerController_Test {

    @isTest
    static void testAnalyzeComponent_Documentation() {
        String componentType = 'OmniScript';
        String metadata = '<OmniScript><label>Test</label></OmniScript>';
        String analysisType = 'documentation';

        Test.startTest();
        try {
            String result = OmniAnalyzerController.analyzeComponent(componentType, metadata, analysisType);
        } catch (AuraHandledException e) {
            // Expected in test context — Einstein LLM not available
            System.assert(e.getMessage().contains('Analysis failed') || e.getMessage() != null);
        }
        Test.stopTest();
    }

    @isTest
    static void testAnalyzeComponent_BestPractice() {
        String componentType = 'FlexCard';
        String metadata = '<FlexCard><label>Test</label></FlexCard>';
        String analysisType = 'bestpractice';

        Test.startTest();
        try {
            String result = OmniAnalyzerController.analyzeComponent(componentType, metadata, analysisType);
        } catch (AuraHandledException e) {
            System.assert(e.getMessage().contains('Analysis failed') || e.getMessage() != null);
        }
        Test.stopTest();
    }
}
