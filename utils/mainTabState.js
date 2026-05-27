const MAIN_TABS = {
  HOME: 'home',
  ADD: 'add'
};

const TAB_DEFINITIONS = [
  {
    tab: MAIN_TABS.HOME,
    selectedIndex: 0,
    title: '调酒配方'
  },
  {
    tab: MAIN_TABS.ADD,
    selectedIndex: 1,
    title: '添加配方'
  }
];

const TRANSITION_CLASS = 'main-tab-enter';

function createInitialMainTabState(tab = MAIN_TABS.HOME) {
  return {
    activeMainTab: normalizeMainTab(tab),
    mainTabTransitionClass: ''
  };
}

function selectMainTab(currentState = {}, tab, options = {}) {
  const targetTab = normalizeMainTab(tab);
  const activeMainTab = normalizeMainTab(currentState.activeMainTab);
  const selectedIndex = getSelectedIndex(targetTab);
  const shouldScrollToTop = options.scrollToTop !== false;
  const changed = targetTab !== activeMainTab;

  return {
    tab: targetTab,
    selectedIndex,
    title: getNavigationTitle(targetTab),
    changed,
    shouldRefreshCocktails: targetTab === MAIN_TABS.HOME,
    shouldScrollToTop: changed && shouldScrollToTop,
    patch: changed
      ? {
        activeMainTab: targetTab,
        mainTabTransitionClass: TRANSITION_CLASS
      }
      : {}
  };
}

function clearTransition() {
  return {
    mainTabTransitionClass: ''
  };
}

function createPendingMainTabStore(globalData) {
  return {
    read() {
      return globalData ? normalizeMainTab(globalData.pendingMainTab || MAIN_TABS.HOME) : MAIN_TABS.HOME;
    },
    hasPending() {
      return Boolean(globalData && globalData.pendingMainTab);
    },
    write(tab) {
      if (globalData) {
        globalData.pendingMainTab = normalizeMainTab(tab);
      }
    },
    consume() {
      if (!globalData || !globalData.pendingMainTab) {
        return '';
      }

      const pendingTab = normalizeMainTab(globalData.pendingMainTab);
      globalData.pendingMainTab = '';
      return pendingTab;
    }
  };
}

function normalizeMainTab(tab) {
  return tab === MAIN_TABS.ADD ? MAIN_TABS.ADD : MAIN_TABS.HOME;
}

function getSelectedIndex(tab) {
  return getDefinition(tab).selectedIndex;
}

function getNavigationTitle(tab) {
  return getDefinition(tab).title;
}

function getDefinition(tab) {
  const normalizedTab = normalizeMainTab(tab);
  return TAB_DEFINITIONS.find((item) => item.tab === normalizedTab) || TAB_DEFINITIONS[0];
}

module.exports = {
  MAIN_TABS,
  createInitialMainTabState,
  createPendingMainTabStore,
  selectMainTab,
  clearTransition,
  normalizeMainTab,
  getSelectedIndex,
  getNavigationTitle
};
