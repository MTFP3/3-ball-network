/**
 * 🛡️ Client-Side Validation Utilities
 * Provides validation functions that mirror server-side Firestore rules
 * Note: These are for UX only - server-side validation is authoritative
 */

export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class DataValidator {
  // String validation
  static validateString(
    value,
    field,
    minLength = 0,
    maxLength = 255,
    required = true
  ) {
    if (!value || value.trim() === '') {
      if (required) {
        throw new ValidationError(field, `${field} is required`);
      }
      return true;
    }

    if (typeof value !== 'string') {
      throw new ValidationError(field, `${field} must be a string`);
    }

    const trimmed = value.trim();
    if (trimmed.length < minLength) {
      throw new ValidationError(
        field,
        `${field} must be at least ${minLength} characters`
      );
    }

    if (trimmed.length > maxLength) {
      throw new ValidationError(
        field,
        `${field} must be no more than ${maxLength} characters`
      );
    }

    return true;
  }

  // Email validation
  static validateEmail(email, required = true) {
    if (!email) {
      if (required) {
        throw new ValidationError('email', 'Email is required');
      }
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      throw new ValidationError('email', 'Please enter a valid email address');
    }

    return true;
  }

  // URL validation
  static validateUrl(url, field = 'url', required = true) {
    if (!url) {
      if (required) {
        throw new ValidationError(field, `${field} is required`);
      }
      return true;
    }

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new ValidationError(
          field,
          `${field} must be a valid HTTP or HTTPS URL`
        );
      }
      if (url.length > 2048) {
        throw new ValidationError(field, `${field} URL is too long`);
      }
    } catch {
      throw new ValidationError(field, `${field} must be a valid URL`);
    }

    return true;
  }

  // Date validation
  static validateDate(date, field = 'date', required = true) {
    if (!date) {
      if (required) {
        throw new ValidationError(field, `${field} is required`);
      }
      return true;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new ValidationError(field, `${field} must be in YYYY-MM-DD format`);
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError(field, `${field} must be a valid date`);
    }

    return true;
  }

  // Role validation
  static validateRole(role, required = true) {
    const validRoles = [
      'player',
      'coach',
      'scout',
      'fan',
      'admin',
      'moderator',
    ];

    if (!role) {
      if (required) {
        throw new ValidationError('role', 'Role is required');
      }
      return true;
    }

    if (!validRoles.includes(role)) {
      throw new ValidationError(
        'role',
        `Role must be one of: ${validRoles.join(', ')}`
      );
    }

    return true;
  }

  // Position validation
  static validatePosition(position, required = true) {
    const validPositions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'];

    if (!position) {
      if (required) {
        throw new ValidationError('position', 'Position is required');
      }
      return true;
    }

    if (!validPositions.includes(position)) {
      throw new ValidationError(
        'position',
        `Position must be one of: ${validPositions.join(', ')}`
      );
    }

    return true;
  }

  // Skill level validation
  static validateSkillLevel(level, required = true) {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'elite'];

    if (!level) {
      if (required) {
        throw new ValidationError('skillLevel', 'Skill level is required');
      }
      return true;
    }

    if (!validLevels.includes(level)) {
      throw new ValidationError(
        'skillLevel',
        `Skill level must be one of: ${validLevels.join(', ')}`
      );
    }

    return true;
  }

  // Number validation
  static validateNumber(value, field, min = null, max = null, required = true) {
    if (value === null || value === undefined || value === '') {
      if (required) {
        throw new ValidationError(field, `${field} is required`);
      }
      return true;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new ValidationError(field, `${field} must be a valid number`);
    }

    if (min !== null && num < min) {
      throw new ValidationError(field, `${field} must be at least ${min}`);
    }

    if (max !== null && num > max) {
      throw new ValidationError(field, `${field} must be no more than ${max}`);
    }

    return true;
  }

  // Game data validation
  static validateGameData(gameData) {
    const errors = [];

    try {
      this.validateString(gameData.teamName, 'Team Name', 2, 100);
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateString(gameData.opponent, 'Opponent', 2, 100);
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateDate(gameData.date, 'Date');
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateString(gameData.uploadedBy, 'Uploaded By', 2, 100);
    } catch (e) {
      errors.push(e);
    }

    if (gameData.videoUrl) {
      try {
        this.validateUrl(gameData.videoUrl, 'Video URL', false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (gameData.score) {
      try {
        this.validateString(gameData.score, 'Score', 0, 20, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (gameData.location) {
      try {
        this.validateString(gameData.location, 'Location', 0, 100, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (gameData.notes) {
      try {
        this.validateString(gameData.notes, 'Notes', 0, 1000, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (gameData.duration) {
      try {
        this.validateNumber(gameData.duration, 'Duration', 1, 10800, false); // Max 3 hours
      } catch (e) {
        errors.push(e);
      }
    }

    return errors;
  }

  // User data validation
  static validateUserData(userData) {
    const errors = [];

    try {
      this.validateString(userData.name, 'Name', 2, 100);
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateEmail(userData.email);
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateRole(userData.role);
    } catch (e) {
      errors.push(e);
    }

    if (userData.bio) {
      try {
        this.validateString(userData.bio, 'Bio', 0, 1000, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.location) {
      try {
        this.validateString(userData.location, 'Location', 0, 100, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.school) {
      try {
        this.validateString(userData.school, 'School', 0, 100, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.position) {
      try {
        this.validatePosition(userData.position, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.skillLevel) {
      try {
        this.validateSkillLevel(userData.skillLevel, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.height) {
      try {
        this.validateNumber(userData.height, 'Height', 1, 300, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.weight) {
      try {
        this.validateNumber(userData.weight, 'Weight', 1, 500, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.gpa) {
      try {
        this.validateNumber(userData.gpa, 'GPA', 0, 4.0, false);
      } catch (e) {
        errors.push(e);
      }
    }

    if (userData.graduationYear) {
      try {
        this.validateNumber(
          userData.graduationYear,
          'Graduation Year',
          2020,
          2040,
          false
        );
      } catch (e) {
        errors.push(e);
      }
    }

    return errors;
  }

  // Contact request validation
  static validateContactRequest(requestData) {
    const errors = [];

    try {
      this.validateString(requestData.to, 'Recipient', 1, 100);
    } catch (e) {
      errors.push(e);
    }

    try {
      this.validateString(requestData.message, 'Message', 1, 1000);
    } catch (e) {
      errors.push(e);
    }

    return errors;
  }

  // Display validation errors in a user-friendly way
  static displayValidationErrors(errors, container) {
    if (!container) return;

    // Clear existing errors
    const existingErrors = container.querySelectorAll('.validation-error');
    existingErrors.forEach(error => error.remove());

    // Add new errors
    errors.forEach(error => {
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      errorElement.style.cssText = `
        color: #dc3545;
        font-size: 14px;
        margin: 4px 0;
        padding: 8px;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      `;
      errorElement.textContent = error.message;

      // Try to position near the relevant field
      const field = container.querySelector(
        `[name="${error.field}"], #${error.field}`
      );
      if (field) {
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        field.style.borderColor = '#dc3545';
      } else {
        container.appendChild(errorElement);
      }
    });
  }

  // Clear validation errors
  static clearValidationErrors(container) {
    if (!container) return;

    const errors = container.querySelectorAll('.validation-error');
    errors.forEach(error => error.remove());

    // Reset field border colors
    const fields = container.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.style.borderColor = '';
    });
  }
}

export default DataValidator;
