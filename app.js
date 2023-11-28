const DataController = (function(){
	let completedGuides = [];

	return {
		toggleCompletedGuides(key) {
			const doesKeyExists = completedGuides.find(guideKey => guideKey === key);

			if(doesKeyExists) {
				// Remove key
				const filteredCompletedKeys = completedGuides.filter(guideKey => guideKey !== key);

				// Reset Array
				completedGuides = [];

				// Set filtered keys
				filteredCompletedKeys.forEach(key => completedGuides.push(key));

				return completedGuides;
			} else {
				// Add key
				completedGuides.push(key);
			}

			return completedGuides;
		}
	}
})();

const UIController = (function(){
	const DOM = {
		notificationTrigger: document.querySelector("#notification-menu"),
		profileTrigger: document.querySelector("#profile-menu"),
		notificationDropdown: document.querySelector("#notification-dropdown"),
		profileDropdown: document.querySelector("#profile-dropdown"),
		guideCheckLists: document.querySelectorAll(".guide"),
		collapsibleTrigger: document.querySelector("#collapsible-trigger"),
		collapsibleMenu: document.querySelector("#collapsible-menu"),
		guideCheckTrigger: document.querySelectorAll(".status-toggle"),
		closeBannerTriggers: document.querySelectorAll("#close-banner"),
		bannerContainer: document.querySelector(".banner"),
		notCompletedIcons: document.querySelectorAll(".circle-dash"),
		loadingSpinnerIcons: document.querySelectorAll(".circle-loader"),
		loadingReverseSpinnerIcons: document.querySelectorAll(".circle-loader-reverse"),
		completedIcons: document.querySelectorAll(".circle-complete"),
		progressStatus: document.querySelector(".progress-bar-container .status"),
		progressIndicator: document.querySelector("#progress-bar .indicator")
	}
	const HIDDEN_CLASS = "hide";

	return {
		getDOM: DOM,
		toggleMenu(dropdownContainer, type="") {
			const dropdownAriaLabel = dropdownContainer.attributes["aria-labelledby"].value;
			const triggerElement = document.querySelector(`#${dropdownAriaLabel}`);

			const isExpanded = triggerElement.attributes["aria-expanded"].value === "true";
			
			// Toggle menu
			dropdownContainer.classList.toggle(HIDDEN_CLASS);
			setTimeout(() => {
				type === "dropdown" && dropdownContainer.classList.toggle("show");
			}, 200);

			if(isExpanded) 
				this.closeMenu(triggerElement, dropdownContainer);
			else
				this.openMenu(triggerElement, dropdownContainer);
		},
		handleEscapeKeyPress(event, triggerElement, menuContainer) {
			if(event.key === "Escape") {
				this.toggleMenu(menuContainer, "dropdown");
			}
		},
		handleArrowKeyPress(event, menuItemIndex, allMenuItems) {
			const allMenuItemsLength = allMenuItems.length - 1;
			const nextMenuItemIndex = menuItemIndex < allMenuItemsLength ? menuItemIndex + 1 : 0;
			const previousMenuItemIndex = menuItemIndex === 0 ? allMenuItemsLength : menuItemIndex - 1;

			if(event.key === "ArrowDown" || event.key === "ArrowRight") {
				if(allMenuItems[nextMenuItemIndex]) {
					allMenuItems.item(nextMenuItemIndex).focus();
				}
			} else if(event.key === "ArrowUp" || event.key === "ArrowLeft") {
				if(allMenuItems[previousMenuItemIndex]) {
					allMenuItems.item(previousMenuItemIndex).focus();
				}
			}
		},
		openMenu(triggerElement, menuContainer) {
			triggerElement.setAttribute("aria-expanded", "true");

			const menuItems = menuContainer.querySelectorAll("[role='menu-item']");
			menuItems.item(0).focus();

			menuItems.forEach((menuItem, menuItemIndex) => menuItem.addEventListener("keyup", event => this.handleArrowKeyPress(event, menuItemIndex, menuItems)));
			menuContainer.addEventListener("keyup", event => this.handleEscapeKeyPress(event, triggerElement, menuContainer));
		},
		closeMenu(triggerElement, menuContainer) {
			triggerElement.focus();
			triggerElement.setAttribute("aria-expanded", "false");
		},
		closeBanner() {
			const parentContainer = DOM.bannerContainer.parentNode;
			parentContainer.removeChild(DOM.bannerContainer);
		},
		handleOpenChecklist(event, guideItemIndex) {
			event.stopPropagation();

			const { target } = event;

			// Remove all active states
			DOM.guideCheckLists.forEach(guideItem => guideItem.classList.remove("active"));

			// Add active state to target guide element
			DOM.guideCheckLists.item(guideItemIndex).classList.toggle("active");
		},
		handleMarkDone(currentTarget, index) {
			currentTarget.setAttribute("aria-selected", "true");

			DOM.completedIcons[index].classList.add(HIDDEN_CLASS);
		    DOM.notCompletedIcons[index].classList.add(HIDDEN_CLASS);
		    DOM.loadingReverseSpinnerIcons[index].classList.add(HIDDEN_CLASS);
		    DOM.loadingSpinnerIcons[index].classList.remove(HIDDEN_CLASS);

		    setTimeout(() => {
		      DOM.completedIcons[index].classList.remove(HIDDEN_CLASS);
		      DOM.loadingSpinnerIcons[index].classList.add(HIDDEN_CLASS);
		    }, 400);
		},
		handleMarkNotDone(currentTarget, index) {
			currentTarget.setAttribute("aria-selected", "false");

			DOM.completedIcons[index].classList.add(HIDDEN_CLASS);
			DOM.loadingReverseSpinnerIcons[index].classList.add(HIDDEN_CLASS);
		    DOM.loadingReverseSpinnerIcons[index].classList.remove(HIDDEN_CLASS);

		    setTimeout(() => {
		      DOM.loadingReverseSpinnerIcons[index].classList.add(HIDDEN_CLASS);
		      DOM.notCompletedIcons[index].classList.remove(HIDDEN_CLASS);
		    }, 400);
		},
		toggleCollapsibleMenu(event) {
			const isExpanded = event.target.attributes["aria-expanded"].value === "true";

			if(isExpanded) {
				event.target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
	              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.71967 8.46967C6.01256 8.17678 6.48744 8.17678 6.78033 8.46967L10.25 11.9393L13.7197 8.46967C14.0126 8.17678 14.4874 8.17678 14.7803 8.46967C15.0732 8.76256 15.0732 9.23744 14.7803 9.53033L10.7803 13.5303C10.4874 13.8232 10.0126 13.8232 9.71967 13.5303L5.71967 9.53033C5.42678 9.23744 5.42678 8.76256 5.71967 8.46967Z" fill="#4A4A4A"/>
	            </svg>`;
			} else {
				event.target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
	              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5303 12.2803C14.2374 12.5732 13.7626 12.5732 13.4697 12.2803L10 8.81066L6.53033 12.2803C6.23744 12.5732 5.76256 12.5732 5.46967 12.2803C5.17678 11.9874 5.17678 11.5126 5.46967 11.2197L9.46967 7.21967C9.76256 6.92678 10.2374 6.92678 10.5303 7.21967L14.5303 11.2197C14.8232 11.5126 14.8232 11.9874 14.5303 12.2803Z" fill="#4A4A4A"/>
	            </svg>`;
			}

			this.toggleMenu(DOM.collapsibleMenu);
		},
	}
})();

const Controller = (function(dtCtrl, uiCtrl){
	const DOM = uiCtrl.getDOM;
	
	function setListener() {
		// Notification Dropdown Trigger -> Toggle Dropdown on Click 
		DOM.notificationTrigger.addEventListener("click", () => uiCtrl.toggleMenu(DOM.notificationDropdown, "dropdown"), true);

		// Profile Dropdown Trigger -> Toggle Dropdown on Click 
		DOM.profileTrigger.addEventListener("click", () => uiCtrl.toggleMenu(DOM.profileDropdown, "dropdown"), true);
		
		// Toggle guide active container by clicking
		DOM.guideCheckLists.forEach((guideItem, guideItemIndex) => guideItem.addEventListener("click", event => uiCtrl.handleOpenChecklist(event, guideItemIndex)))

		DOM.closeBannerTriggers.forEach(closeBannerTrigger => closeBannerTrigger.addEventListener("click", uiCtrl.closeBanner, true));

		// Toggle collapsible on click event
		DOM.collapsibleTrigger.addEventListener("click", event => uiCtrl.toggleCollapsibleMenu(event), true);

		// Toggle collapsible when UP Arrow Key is entered 
		DOM.collapsibleTrigger.addEventListener("keyup", event => {
			if(event.key === "ArrowUp") {
				uiCtrl.toggleCollapsibleMenu(event);
			}
		}, true);

		// Toggle Guide Item State
		DOM.guideCheckTrigger.forEach((trigger, triggerIndex) => trigger.addEventListener("click", event => changeGuideStatus(event, triggerIndex)));
	}

	function changeGuideStatus(event, triggerIndex) {
		const { currentTarget } = event;
		const isSelected = currentTarget.attributes["aria-selected"].value === "true";
		
		if(isSelected) {
			// Stop Event propagation if status is marked as incomplete
			event.stopPropagation();

			// Handlle Check Done
			uiCtrl.handleMarkNotDone(currentTarget, triggerIndex);
		} else {
			// Handlle Check Done
			uiCtrl.handleMarkDone(currentTarget, triggerIndex);
		}

		const completedGuides = dtCtrl.toggleCompletedGuides(triggerIndex + 1);
		const completedGuidesLength = completedGuides.length;

		DOM.progressStatus.innerHTML = `${completedGuidesLength} / 5 completed`;
		DOM.progressIndicator.style.width = `${20 * completedGuidesLength}%`;
	}

	return {
		init() {
			setListener();
		}
	}
})(DataController, UIController);

Controller.init();
