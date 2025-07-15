// 📊 Analytics Logger Module
// Secure analytics and audit logging functionality
import {
  getAnalytics,
  logEvent,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { db } from './firebaseConfig.js';

let analytics;

/**
 * Initialize analytics
 */
export function initializeAnalytics() {
  try {
    if (typeof window !== 'undefined') {
      analytics = getAnalytics();
      console.log('📊 Analytics initialized');
    }
  } catch (error) {
    console.warn('⚠️ Analytics initialization failed:', error);
  }
}

/**
 * Log analytics event to Firebase Analytics
 */
export function logAnalyticsEvent(eventName, parameters = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        ...parameters,
      });
      console.log('📊 Analytics event logged:', eventName, parameters);
    }
  } catch (error) {
    console.warn('⚠️ Failed to log analytics event:', error);
  }
}

/**
 * Log security-related events to Firestore for audit trail
 */
export async function logSecurityEvent(eventType, details = {}) {
  try {
    await addDoc(collection(db, 'security_audit'), {
      eventType,
      details,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: null, // Will be populated by server-side functions
      sessionId: generateSessionId(),
    });

    console.log('🔒 Security event logged:', eventType);

    // Also log to analytics for monitoring
    logAnalyticsEvent('security_event', {
      event_type: eventType,
      ...details,
    });
  } catch (error) {
    console.error('❌ Failed to log security event:', error);
  }
}

/**
 * Log user authentication events
 */
export function logAuthEvent(eventType, userId = null, details = {}) {
  const authEvents = {
    login_success: 'login',
    logout: 'logout',
    registration: 'sign_up',
    role_assignment: 'role_change',
    login_failure: 'login_failure',
  };

  const analyticsEventName = authEvents[eventType] || 'auth_event';

  logAnalyticsEvent(analyticsEventName, {
    user_id: userId,
    auth_method: 'firebase',
    ...details,
  });

  // Log security-sensitive events to audit trail
  if (['login_failure', 'role_assignment'].includes(eventType)) {
    logSecurityEvent(eventType, {
      userId,
      ...details,
    });
  }
}

/**
 * Log role management events
 */
export function logRoleEvent(eventType, userId, role, details = {}) {
  logSecurityEvent('role_management', {
    eventType,
    userId,
    role,
    ...details,
  });

  logAnalyticsEvent('role_management', {
    event_type: eventType,
    user_id: userId,
    role: role,
    ...details,
  });
}

/**
 * Log page views and navigation
 */
export function logPageView(pageName, additionalData = {}) {
  logAnalyticsEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_name: pageName,
    ...additionalData,
  });
}

/**
 * Log user interactions
 */
export function logUserInteraction(action, element, details = {}) {
  logAnalyticsEvent('user_interaction', {
    action,
    element_type: element?.tagName?.toLowerCase(),
    element_id: element?.id,
    element_class: element?.className,
    ...details,
  });
}

/**
 * Generate a unique session ID for tracking
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log performance metrics
 */
export function logPerformanceMetric(metricName, value, details = {}) {
  logAnalyticsEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    ...details,
  });
}

/**
 * Log errors for monitoring
 */
export function logError(error, context = {}) {
  console.error('Error logged:', error);

  logAnalyticsEvent('error', {
    error_message: error.message,
    error_stack: error.stack,
    error_name: error.name,
    context: JSON.stringify(context),
  });
}

// Initialize analytics when module loads
initializeAnalytics();

// Set up global error logging
window.addEventListener('error', event => {
  logError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', event => {
  logError(new Error(event.reason), {
    type: 'unhandled_promise_rejection',
  });
});

export default {
  logAnalyticsEvent,
  logSecurityEvent,
  logAuthEvent,
  logRoleEvent,
  logPageView,
  logUserInteraction,
  logPerformanceMetric,
  logError,
};
