const cocktailListView = require('./cocktailListView');

function createInitialState() {
  return {
    customCocktails: [],
    visibleCocktails: [],
    searchQuery: '',
    sortOptions: cocktailListView.SORT_OPTIONS,
    sortMode: cocktailListView.SORT_MODES.UPDATED_AT,
    sortIndex: 0,
    sortLabel: cocktailListView.SORT_OPTIONS[0],
    isManaging: false,
    manageButtonText: '管理',
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    showMorePanel: false,
    activeCocktail: null
  };
}

function buildStatePatch(cocktails = [], state = {}) {
  const listView = cocktailListView.buildCocktailListView({
    cocktails,
    query: state.searchQuery,
    sortMode: state.sortMode,
    selectedIds: state.selectedIds,
    ingredientsPreviewEllipsis: false
  });

  return {
    customCocktails: cocktails,
    visibleCocktails: listView.items,
    selectedCount: (state.selectedIds || []).length,
    allVisibleSelected: listView.allVisibleSelected,
    manageButtonText: state.isManaging ? '完成' : '管理'
  };
}

function createSearchPatch(state = {}, searchQuery = '') {
  return {
    searchQuery,
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      searchQuery,
      selectedIds: []
    })
  };
}

function createSortPatch(state = {}, sortIndex = 0) {
  const normalizedSortIndex = Number(sortIndex);
  const sortMode = cocktailListView.getSortModeFromIndex(normalizedSortIndex);
  const sortLabel = cocktailListView.getSortLabel(normalizedSortIndex);
  return {
    sortIndex: normalizedSortIndex,
    sortMode,
    sortLabel,
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      sortIndex: normalizedSortIndex,
      sortMode,
      sortLabel,
      selectedIds: []
    })
  };
}

function createManageModePatch(state = {}) {
  const isManaging = !state.isManaging;
  return {
    isManaging,
    manageButtonText: isManaging ? '完成' : '管理',
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    showMorePanel: false,
    activeCocktail: null,
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      isManaging,
      selectedIds: []
    })
  };
}

function createToggleSelectedPatch(state = {}, id) {
  const selectedMap = cocktailListView.buildIdMap(state.selectedIds);
  const selectedIds = selectedMap[id]
    ? state.selectedIds.filter((item) => item !== id)
    : [...state.selectedIds, id];

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      selectedIds
    })
  };
}

function createToggleAllVisiblePatch(state = {}) {
  const selectedIds = state.allVisibleSelected
    ? []
    : (state.visibleCocktails || []).map((cocktail) => cocktail.id);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      selectedIds
    })
  };
}

function findVisibleCocktail(state = {}, id) {
  return (state.visibleCocktails || []).find((cocktail) => cocktail.id === id) || null;
}

function createOpenMorePatch(state = {}, id) {
  const activeCocktail = findVisibleCocktail(state, id);
  if (!activeCocktail) {
    return {};
  }

  return {
    activeCocktail,
    showMorePanel: true
  };
}

function createCloseMorePatch() {
  return {
    activeCocktail: null,
    showMorePanel: false
  };
}

function createAfterBatchDeletePatch(state = {}) {
  return {
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    isManaging: false,
    manageButtonText: '管理',
    ...buildStatePatch(state.customCocktails || [], {
      ...state,
      selectedIds: [],
      isManaging: false
    })
  };
}

function createDeleteOneIntent(cocktail = {}) {
  return {
    title: '删除自定义配方',
    content: `确认删除「${cocktail.name || '这条配方'}」吗？删除后不可恢复。`,
    confirmText: '删除',
    confirmColor: '#ff7a66'
  };
}

function createBatchDeleteIntent(selectedCount) {
  return {
    title: '批量删除',
    content: `确认删除所选 ${selectedCount} 条自定义配方吗？删除后不可恢复。`,
    confirmText: '删除',
    confirmColor: '#ff7a66'
  };
}

module.exports = {
  createInitialState,
  buildStatePatch,
  createSearchPatch,
  createSortPatch,
  createManageModePatch,
  createToggleSelectedPatch,
  createToggleAllVisiblePatch,
  findVisibleCocktail,
  createOpenMorePatch,
  createCloseMorePatch,
  createAfterBatchDeletePatch,
  createDeleteOneIntent,
  createBatchDeleteIntent
};
