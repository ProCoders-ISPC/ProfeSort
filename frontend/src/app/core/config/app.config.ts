

export const APP_CONFIG = {

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

 
  TIMEOUTS: {
    HTTP_REQUEST: 30000, 
    ALERT_DURATION: 3000, 
    SUCCESS_MESSAGE_DURATION: 2000, 
  },

  
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_STRING_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
  },

  
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
    SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente.',
    VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
    GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
  },

  
  SUCCESS_MESSAGES: {
    SAVE_SUCCESS: 'Guardado exitosamente',
    UPDATE_SUCCESS: 'Actualizado exitosamente',
    DELETE_SUCCESS: 'Eliminado exitosamente',
    OPERATION_SUCCESS: 'Operación completada exitosamente',
  },

  
  FORM_CONFIG: {
    REQUIRED_FIELDS_MESSAGE: 'Los campos marcados con * son obligatorios',
    UNSAVED_CHANGES_MESSAGE: '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
  },
};