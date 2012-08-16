(function(){
	
	function ActiveFilterListView(filterList) {
		this.filterList = filterList;
		this.filterList.on("filterAdded", this.onFilterAdded.bind(this));
		this.filterList.on("filterRemoved", this.onFilterRemoved.bind(this));
		this.container = $("#filter-list");
        this.filterMessageEl = $("#filter-list-empty");

        this.filterItemsViewsByName = {};

        this.makeDragable();
        this.updateFilterCount();
	}

	ActiveFilterListView.prototype = {
		updateFilterCount: function() {
            this.filterMessageEl.toggle(!this.filterList.filters.length);
        },

        makeDragable: function() {
            var self = this;
            this.container.sortable({
                distance: 15,
                axis: 'y',
                items: 'li',
                handle: '.dragpoint',
                start: function(event, ui) {
                    ui.helper.addClass("dragging");
                },
                beforeStop: function(event, ui) {
                    ui.helper.removeClass("dragging");
                },            
                update: function(event, ui) {
                    $(this).find("li").each(function (index, el) {
                        var filterItemView = $(el).data("filterItemView");
                        if (filterItemView)
                            filterItemView.filter.order = index;
                    });
                    self.filterList.updateFiltersOrder();
                }
            });
        },

        onFilterAdded: function(filter) {
        	var itemView = new Global.FilterItemView(filter);
            this.filterItemsViewsByName["_" + filter.name] = itemView;
            this.container.append(itemView.el);
            this.updateFilterCount();
        },

        onFilterRemoved: function(filter, useAnimation) {
        	var self = this,
                filterItemView = this.filterItemsViewsByName["_" + filter.name];
            if (!filterItemView)
                return;
            if (useAnimation) {
                filterItemView.el.slideUp(100, function() {
                    filterItemView.el.remove();
                    self.updateFilterCount();
                });
            } else {
                filterItemView.el.remove();
                this.updateFilterCount();
            }
        }
	};

	Global.ActiveFilterListView = ActiveFilterListView;

})();