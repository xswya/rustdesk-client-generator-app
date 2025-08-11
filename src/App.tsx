import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigSchema, Config, defaultConfig } from './types/config';
import { storage } from './utils/storage';
import { exportUtils } from './utils/export';
import { ServerSection } from './components/forms/ServerSection';
import { SecuritySection } from './components/forms/SecuritySection';
import { BrandingSection } from './components/forms/BrandingSection';
import { AdvancedSection } from './components/forms/AdvancedSection';
import { BuildSection } from './components/forms/BuildSection';
import { StepIndicator } from './components/layout/StepIndicator';
import { Header } from './components/layout/Header';
import { ExportPanel } from './components/layout/ExportPanel';
import { Button } from './components/ui/Button';
import { Save, Download, FileText, Settings } from 'lucide-react';

const steps = [
  { id: 'server', title: 'Servidor', description: 'Configuración del servidor RustDesk' },
  { id: 'security', title: 'Seguridad', description: 'Políticas de seguridad y acceso' },
  { id: 'branding', title: 'Branding', description: 'Personalización visual del cliente' },
  { id: 'advanced', title: 'Avanzado', description: 'Configuraciones avanzadas' },
  { id: 'build', title: 'Build', description: 'Opciones de compilación y salida' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const form = useForm<Config>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: defaultConfig,
    mode: 'onChange'
  });

  const { handleSubmit, watch, setValue, formState: { errors, isValid } } = form;
  const watchedValues = watch();

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = storage.load();
    if (savedConfig) {
      Object.keys(savedConfig).forEach((key) => {
        setValue(key as keyof Config, savedConfig[key as keyof Config]);
      });
    }
  }, [setValue]);

  // Guardar automáticamente en localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        storage.save(value as Config);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: Config) => {
    console.log('Configuración final:', data);
    setShowExportPanel(true);
  };

  const handleExportJson = () => {
    exportUtils.downloadConfigJson(watchedValues);
  };

  const handleExportEnv = () => {
    exportUtils.downloadEnvFile(watchedValues);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <ServerSection form={form} />;
      case 1:
        return <SecuritySection form={form} />;
      case 2:
        return <BrandingSection form={form} />;
      case 3:
        return <AdvancedSection form={form} />;
      case 4:
        return <BuildSection form={form} />;
      default:
        return <ServerSection form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Indicador de pasos */}
        <div className="mb-8">
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={goToStep}
            errors={errors}
          />
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-3">
              {renderCurrentSection()}
              
              {/* Navegación */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Anterior
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => storage.save(watchedValues)}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Guardar Borrador
                  </Button>
                  
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={!isValid}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Finalizar Configuración
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Vista previa de configuración */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Vista Previa</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Servidor:</span>
                      <span className="ml-2 font-mono text-xs">
                        {watchedValues.server?.RENDEZVOUS_SERVER || 'No configurado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Producto:</span>
                      <span className="ml-2">{watchedValues.branding?.APP_NAME}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Versión:</span>
                      <span className="ml-2">{watchedValues.build?.VERSION}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones de exportación */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Exportar</h3>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportJson}
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      config.json
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportEnv}
                      className="w-full flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      .env.example
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Panel de exportación */}
      {showExportPanel && (
        <ExportPanel
          config={watchedValues}
          onClose={() => setShowExportPanel(false)}
        />
      )}
    </div>
  );
}

export default App;