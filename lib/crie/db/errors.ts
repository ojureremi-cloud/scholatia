export type CrieErrorCode =
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'version_conflict'
  | 'consent_required'
  | 'institution_scope'
  | 'internal';

export class CrieError extends Error {
  code: CrieErrorCode;
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(code: CrieErrorCode, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'CrieError';
    this.code = code;
    this.status = statusForCode(code);
    this.fieldErrors = fieldErrors;
  }
}

export class CrieNotFoundError extends CrieError {
  constructor(resource: string, id?: string) {
    super('not_found', id ? `${resource} '${id}' was not found.` : `${resource} was not found.`);
  }
}

export class CrieVersionConflictError extends CrieError {
  constructor(crieId: string, expectedVersion: number, actualVersion: number) {
    super(
      'version_conflict',
      `${crieId} has changed since version ${expectedVersion} (current version ${actualVersion}).`,
    );
  }
}

export class CriePermissionError extends CrieError {
  constructor(permission: string, message?: string) {
    super('forbidden', message ?? `The authenticated principal lacks permission '${permission}'.`);
  }
}

export class CrieConsentError extends CrieError {
  constructor(scope: string, message?: string) {
    super('consent_required', message ?? `Consent is required for scope '${scope}'.`);
  }
}

export class CrieInstitutionScopeError extends CrieError {
  constructor(institutionId: string) {
    super('institution_scope', `Institution '${institutionId}' is outside the authenticated scope.`);
  }
}

export class CrieValidationError extends CrieError {
  constructor(fieldErrors: Record<string, string>, message = 'The submitted fields are invalid.') {
    super('validation', message, fieldErrors);
  }
}

function statusForCode(code: CrieErrorCode): number {
  switch (code) {
    case 'unauthorized':
      return 401;
    case 'forbidden':
    case 'consent_required':
    case 'institution_scope':
      return 403;
    case 'not_found':
      return 404;
    case 'conflict':
    case 'version_conflict':
      return 409;
    case 'validation':
      return 400;
    case 'internal':
      return 500;
  }
}
