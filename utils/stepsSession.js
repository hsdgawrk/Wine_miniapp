const SWIPE_DISTANCE = 46;
const SWIPE_VERTICAL_RATIO = 0.8;
const SWIPE_MAX_ELAPSED = 900;

function createStepsSession(steps = []) {
  const normalizedSteps = normalizeSteps(steps);
  return createSnapshot(normalizedSteps, 0);
}

function goToStep(session = {}, nextStep) {
  const steps = normalizeSteps(session.steps);
  if (!steps.length) {
    return createSnapshot([], 0);
  }

  const boundedStep = Math.max(0, Math.min(Number(nextStep) || 0, steps.length - 1));
  return createSnapshot(steps, boundedStep);
}

function moveStep(session = {}, direction) {
  const currentStep = Number(session.currentStep) || 0;
  const delta = direction === 'previous' ? -1 : 1;
  return goToStep(session, currentStep + delta);
}

function resolveSwipe(start = {}, end = {}) {
  const deltaX = Number(end.x) - Number(start.x);
  const deltaY = Number(end.y) - Number(start.y);
  const elapsed = Number(end.time) - Number(start.time);
  const isHorizontalSwipe = Math.abs(deltaX) > SWIPE_DISTANCE
    && Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_VERTICAL_RATIO;

  if (!isHorizontalSwipe || elapsed > SWIPE_MAX_ELAPSED) {
    return '';
  }

  return deltaX < 0 ? 'next' : 'previous';
}

function captureTouch(touch, time) {
  if (!touch) {
    return null;
  }

  return {
    x: Number(touch.clientX) || 0,
    y: Number(touch.clientY) || 0,
    time: Number(time) || Date.now()
  };
}

function createSnapshot(steps, currentStep) {
  const total = steps.length;
  const boundedStep = total ? Math.max(0, Math.min(currentStep, total - 1)) : 0;

  return {
    steps,
    deckSteps: buildDeckSteps(steps, boundedStep),
    currentStep: boundedStep,
    currentStepNumber: total ? boundedStep + 1 : 0,
    currentProgress: calculateProgress(boundedStep, total)
  };
}

function calculateProgress(current, total) {
  if (total === 0) {
    return 0;
  }
  return Math.round(((current + 1) / total) * 100);
}

function buildDeckSteps(steps, currentStep) {
  const total = steps.length;

  return steps.map((step, index) => {
    const distance = index - currentStep;
    const absoluteDistance = Math.abs(distance);
    const displayNumber = step.number || index + 1;
    let stackClass = 'is-hidden';
    let zIndex = 1;

    if (distance === -2) {
      stackClass = 'is-far-prev';
      zIndex = 8;
    } else if (distance === -1) {
      stackClass = 'is-prev';
      zIndex = 14;
    } else if (distance === 0) {
      stackClass = 'is-current';
      zIndex = 24;
    } else if (distance === 1) {
      stackClass = 'is-next';
      zIndex = 13;
    } else if (distance === 2) {
      stackClass = 'is-far-next';
      zIndex = 7;
    }

    return {
      ...step,
      deckKey: `${displayNumber}-${index}`,
      displayNumber,
      positionText: `${index + 1}/${total}`,
      isCurrent: distance === 0,
      isVisible: absoluteDistance <= 2,
      stackClass,
      tone: index % 4,
      zIndex
    };
  });
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.map((step, index) => ({
    ...step,
    number: step.number || index + 1
  }));
}

module.exports = {
  createStepsSession,
  goToStep,
  moveStep,
  resolveSwipe,
  captureTouch,
  calculateProgress,
  buildDeckSteps
};
