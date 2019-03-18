module powerbi.extensibility.visual {
    // powerbi.visuals
    import ISelectionId = powerbi.visuals.ISelectionId;

    /**
     * Interface for BarCharts viewmodel.
     *
     * @interface
     * @property {BarChartDataPoint[]} dataPoints - Set of data points the visual will render.
     * @property {number} dataMax                 - Maximum data value in the set of data points.
     */
    interface BarChartViewModel {
        dataPoints: BarChartDataPoint[];
        dataMax: number;
        settings: BarChartSettings;
    };

    /**
     * Interface for BarChart data points.
     *
     * @interface
     * @property {number} value             - Data value for point.
     * @property {string} category          - Corresponding category of data value.
     * @property {string} color             - Color corresponding to data point.
     * @property {ISelectionId} selectionId - Id assigned to data point for cross filtering
     *                                        and visual interaction.
     */
    interface BarChartDataPoint {
        value: PrimitiveValue;
        category: string;
        color: string;
        strokeColor: string;
        strokeWidth: number;
        selectionId: ISelectionId;
    };


    enum twoValsEnum {
        above,under
    };

    enum specialValsEnum {
        coffee, warning, musicalNote
    }
    /**
     * Interface for BarChart settings.
     *
     * @interface
     * @property {{show:boolean}} enableAxis - Object property that allows axis to be enabled.
     * @property {{generalView.opacity:number}} Bars Opacity - Controls opacity of plotted bars, values range between 10 (almost transparent) to 100 (fully opaque, default)
     * @property {{generalView.showHelpLink:boolean}} Show Help Button - When TRUE, the plot displays a button which launch a link to documentation.
     */
    interface BarChartSettings {
        enableAxis: {
            show: boolean;
            fill: string;
        };

        generalView: {
            opacity: number;
            showBugBashData: boolean;
            showHelpLink: boolean;
            helpLinkColor: string;
            specialEnumeration: specialValsEnum;
        };

        testAnalyticsProperty: {
            show: boolean;
            displayName: string;
            opacity: number;
            showHelpLink: boolean;
            helpLinkColor: string;
            specialEnumeration: specialValsEnum;
        };

        CardWithManyPropertiesAnalytics: {
            show: boolean;
            displayName: string;
            unboundIntegerProperty: number;
            boundIntegerProperty: number;
            unboundNumericProperty: number;
            boundNumericProperty: number;
            booleanProperty: boolean;
            textProperty: string;
            specialEnumeration: specialValsEnum
            colorProperty: string;
            nullableColorProperty: string;
            formattingLableDisplayUnitsProperty: number;
            formattingAlignmentProperty: string;
            formattingFontSizeProperty: number;
        };

        CardWithManyPropertiesFormatting: {
            show: boolean;
            displayName: string;
            unboundIntegerProperty: number;
            boundIntegerProperty: number;
            unboundNumericProperty: number;
            boundNumericProperty: number;
            booleanProperty: boolean;
            textProperty: string;
            specialEnumeration: specialValsEnum
            colorProperty: string;
            nullableColorProperty: string;
            formattingLableDisplayUnitsProperty: number;
            formattingAlignmentProperty: string;
            formattingFontSizeProperty: number;
        };
    }

    /**
     * Function that converts queried data into a view model that will be used by the visual.
     *
     * @function
     * @param {VisualUpdateOptions} options - Contains references to the size of the container
     *                                        and the dataView which contains all the data
     *                                        the visual had queried.
     * @param {IVisualHost} host            - Contains references to the host which contains services
     */
    function visualTransform(options: VisualUpdateOptions, host: IVisualHost): BarChartViewModel {
        let dataViews = options.dataViews;
        let defaultSettings: BarChartSettings = {
            enableAxis: {
                show: false,
                fill: "#000000",
            },
            generalView: {
                opacity: 100,
                showBugBashData: false,
                showHelpLink: false,
                helpLinkColor: "#80B0E0",
                specialEnumeration: specialValsEnum.coffee
            },
            testAnalyticsProperty: {
                show: false,
                displayName: "Analytics Instance",
                opacity: 100,
                showHelpLink: false,
                helpLinkColor: "#80B0E0",
                specialEnumeration: specialValsEnum.coffee
            },
            CardWithManyPropertiesAnalytics: {
                show: false,
                displayName: "Analytics Instance",
                unboundIntegerProperty: 10,
                boundIntegerProperty: 20,
                unboundNumericProperty: 10.5,
                boundNumericProperty: 20.5,
                booleanProperty: false,
                textProperty: "What is your name?",
                specialEnumeration: specialValsEnum.coffee,
                colorProperty: "#8800FF",
                nullableColorProperty: "#00FF88",
                formattingLableDisplayUnitsProperty: 0,
                formattingAlignmentProperty: 'right',
                formattingFontSizeProperty: 10
            },
            CardWithManyPropertiesFormatting: {
                show: false,
                displayName: "Formatting Instance",
                unboundIntegerProperty: 10,
                boundIntegerProperty: 20,
                unboundNumericProperty: 10.5,
                boundNumericProperty: 20.5,
                booleanProperty: false,
                textProperty: "What is your quest?",
                specialEnumeration: specialValsEnum.coffee,
                colorProperty: "#8800FF",
                nullableColorProperty: "#00FF88",
                formattingLableDisplayUnitsProperty: 0,
                formattingAlignmentProperty: 'right',
                formattingFontSizeProperty: 10
            },
        };
        let viewModel: BarChartViewModel = {
            dataPoints: [],
            dataMax: 0,
            settings: <BarChartSettings>{}
        };

        if (!dataViews
            || !dataViews[0]
            || !dataViews[0].categorical
            || !dataViews[0].categorical.categories
            || !dataViews[0].categorical.categories[0].source
            || !dataViews[0].categorical.values
        ) {
            return viewModel;
        }

        let categorical = dataViews[0].categorical;
        let category = categorical.categories[0];
        let dataValue = categorical.values[0];

        let barChartDataPoints: BarChartDataPoint[] = [];
        let dataMax: number;

        let colorPalette: ISandboxExtendedColorPalette = host.colorPalette;
        let objects = dataViews[0].metadata.objects;

        const strokeColor: string = getColumnStrokeColor(colorPalette);

        let barChartSettings: BarChartSettings = {
            enableAxis: {
                show: getValue<boolean>(objects, 'enableAxis', 'show', defaultSettings.enableAxis.show),
                fill: getAxisTextFillColor(objects, colorPalette, defaultSettings.enableAxis.fill),
            },
            generalView: {
                opacity: getValue<number>(objects, 'generalView', 'opacity', defaultSettings.generalView.opacity),
                showBugBashData: getValue<boolean>(objects, 'generalView', 'showBugBashData', defaultSettings.generalView.showBugBashData),
                showHelpLink: getValue<boolean>(objects, 'generalView', 'showHelpLink', defaultSettings.generalView.showHelpLink),
                helpLinkColor: strokeColor,
                specialEnumeration: getValue<specialValsEnum>(objects, 'generalView', 'specialEnumeration', defaultSettings.generalView.specialEnumeration)
            },
            testAnalyticsProperty: {
                show: getValue<boolean>(objects, 'testAnalyticsProperty', 'show', defaultSettings.testAnalyticsProperty.show),
                displayName: getValue<string>(objects, 'testAnalyticsProperty', 'displayName', defaultSettings.testAnalyticsProperty.displayName),
                opacity: getValue<number>(objects, 'testAnalyticsProperty', 'opacity', defaultSettings.testAnalyticsProperty.opacity),
                showHelpLink: getValue<boolean>(objects, 'testAnalyticsProperty', 'showHelpLink', defaultSettings.testAnalyticsProperty.showHelpLink),
                helpLinkColor: strokeColor,
                specialEnumeration: getValue<specialValsEnum>(objects, 'testAnalyticsProperty', 'specialEnumeration', defaultSettings.testAnalyticsProperty.specialEnumeration)
            },
            CardWithManyPropertiesAnalytics: {
                show: getValue<boolean>(objects, 'CardWithManyPropertiesAnalytics', 'show', defaultSettings.CardWithManyPropertiesAnalytics.show),
                displayName: getValue<string>(objects, 'CardWithManyPropertiesAnalytics', 'displayName', defaultSettings.CardWithManyPropertiesAnalytics.displayName),
                unboundIntegerProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'unboundIntegerProperty', defaultSettings.CardWithManyPropertiesAnalytics.unboundIntegerProperty),
                boundIntegerProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'boundIntegerProperty', defaultSettings.CardWithManyPropertiesAnalytics.boundIntegerProperty),
                unboundNumericProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'unboundNumericProperty', defaultSettings.CardWithManyPropertiesAnalytics.unboundNumericProperty),
                boundNumericProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'boundNumericProperty', defaultSettings.CardWithManyPropertiesAnalytics.boundNumericProperty),
                booleanProperty: getValue<boolean>(objects, 'CardWithManyPropertiesAnalytics', 'booleanProperty', defaultSettings.CardWithManyPropertiesAnalytics.booleanProperty),
                textProperty: getValue<string>(objects, 'CardWithManyPropertiesAnalytics', 'textProperty', defaultSettings.CardWithManyPropertiesAnalytics.textProperty),
                specialEnumeration: getValue<specialValsEnum>(objects, 'CardWithManyPropertiesAnalytics', 'specialEnumeration', defaultSettings.testAnalyticsProperty.specialEnumeration),
                colorProperty: getValue<string>(objects, 'CardWithManyPropertiesAnalytics', 'colorProperty', defaultSettings.CardWithManyPropertiesAnalytics.colorProperty),
                nullableColorProperty: getValue<string>(objects, 'CardWithManyPropertiesAnalytics', 'nullableColorProperty', defaultSettings.CardWithManyPropertiesAnalytics.nullableColorProperty),
                formattingLableDisplayUnitsProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'formattingLableDisplayUnitsProperty', defaultSettings.CardWithManyPropertiesAnalytics.formattingLableDisplayUnitsProperty),
                formattingAlignmentProperty: getValue<string>(objects, 'CardWithManyPropertiesAnalytics', 'formattingAlignmentProperty', defaultSettings.CardWithManyPropertiesAnalytics.formattingAlignmentProperty),
                formattingFontSizeProperty: getValue<number>(objects, 'CardWithManyPropertiesAnalytics', 'formattingFontSizeProperty', defaultSettings.CardWithManyPropertiesAnalytics.formattingFontSizeProperty)
            },
            CardWithManyPropertiesFormatting: {
                show: getValue<boolean>(objects, 'CardWithManyPropertiesFormatting', 'show', defaultSettings.CardWithManyPropertiesFormatting.show),
                displayName: getValue<string>(objects, 'CardWithManyPropertiesFormatting', 'displayName', defaultSettings.CardWithManyPropertiesFormatting.displayName),
                unboundIntegerProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'unboundIntegerProperty', defaultSettings.CardWithManyPropertiesFormatting.unboundIntegerProperty),
                boundIntegerProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'boundIntegerProperty', defaultSettings.CardWithManyPropertiesFormatting.boundIntegerProperty),
                unboundNumericProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'unboundNumericProperty', defaultSettings.CardWithManyPropertiesFormatting.unboundNumericProperty),
                boundNumericProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'boundNumericProperty', defaultSettings.CardWithManyPropertiesFormatting.boundNumericProperty),
                booleanProperty: getValue<boolean>(objects, 'CardWithManyPropertiesFormatting', 'booleanProperty', defaultSettings.CardWithManyPropertiesFormatting.booleanProperty),
                textProperty: getValue<string>(objects, 'CardWithManyPropertiesFormatting', 'textProperty', defaultSettings.CardWithManyPropertiesFormatting.textProperty),
                specialEnumeration: getValue<specialValsEnum>(objects, 'CardWithManyPropertiesFormatting', 'specialEnumeration', defaultSettings.testAnalyticsProperty.specialEnumeration),
                colorProperty: getValue<string>(objects, 'CardWithManyPropertiesFormatting', 'colorProperty', defaultSettings.CardWithManyPropertiesFormatting.colorProperty),
                nullableColorProperty: getValue<string>(objects, 'CardWithManyPropertiesFormatting', 'nullableColorProperty', defaultSettings.CardWithManyPropertiesFormatting.nullableColorProperty),
                formattingLableDisplayUnitsProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'formattingLableDisplayUnitsProperty', defaultSettings.CardWithManyPropertiesFormatting.formattingLableDisplayUnitsProperty),
                formattingAlignmentProperty: getValue<string>(objects, 'CardWithManyPropertiesFormatting', 'formattingAlignmentProperty', defaultSettings.CardWithManyPropertiesFormatting.formattingAlignmentProperty),
                formattingFontSizeProperty: getValue<number>(objects, 'CardWithManyPropertiesFormatting', 'formattingFontSizeProperty', defaultSettings.CardWithManyPropertiesFormatting.formattingFontSizeProperty)
            },
        };

        const strokeWidth: number = getColumnStrokeWidth(colorPalette.isHighContrast);

        for (let i = 0, len = Math.max(category.values.length, dataValue.values.length); i < len; i++) {
            const color: string = getColumnColorByIndex(category, i, colorPalette);

            const selectionId: ISelectionId = host.createSelectionIdBuilder()
                .withCategory(category, i)
                .createSelectionId();

            barChartDataPoints.push({
                color,
                strokeColor,
                strokeWidth,
                selectionId,
                value: dataValue.values[i],
                category: `${category.values[i]}`,
            });
        }

        dataMax = <number>dataValue.maxLocal;

        return {
            dataPoints: barChartDataPoints,
            dataMax: dataMax,
            settings: barChartSettings,
        };
    }

    function getColumnColorByIndex(
        category: DataViewCategoryColumn,
        index: number,
        colorPalette: ISandboxExtendedColorPalette,
    ): string {
        if (colorPalette.isHighContrast) {
            return colorPalette.background.value;
        }

        const defaultColor: Fill = {
            solid: {
                color: colorPalette.getColor(`${category.values[index]}`).value,
            }
        };

        return getCategoricalObjectValue<Fill>(
            category,
            index,
            'colorSelector',
            'fill',
            defaultColor
        ).solid.color;
    }

    function getColumnStrokeColor(colorPalette: ISandboxExtendedColorPalette): string {
        return colorPalette.isHighContrast
            ? colorPalette.foreground.value
            : null;
    }

    function getColumnStrokeWidth(isHighContrast: boolean): number {
        return isHighContrast
            ? 2
            : 0;
    }

    function getAxisTextFillColor(
        objects: DataViewObjects,
        colorPalette: ISandboxExtendedColorPalette,
        defaultColor: string
    ): string {
        if (colorPalette.isHighContrast) {
            return colorPalette.foreground.value;
        }

        return getValue<Fill>(
            objects,
            "enableAxis",
            "fill",
            {
                solid: {
                    color: defaultColor,
                }
            },
        ).solid.color;
    }

    export class BarChart implements IVisual {
        private svg: d3.Selection<SVGElement>;
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private barContainer: d3.Selection<SVGElement>;
        private xAxis: d3.Selection<SVGElement>;
        private barDataPoints: BarChartDataPoint[];
        private barChartSettings: BarChartSettings;
        private tooltipServiceWrapper: ITooltipServiceWrapper;
        private locale: string;
        private helpLinkElement: d3.Selection<any>;
        private bugBashElement: d3.Selection<any>;
        private element: HTMLElement;
        private isLandingPageOn: boolean;
        private LandingPageRemoved: boolean;
        private LandingPage: d3.Selection<any>;

        private barSelection: d3.selection.Update<BarChartDataPoint>;

        static Config = {
            xScalePadding: 0.1,
            solidOpacity: 1,
            transparentOpacity: 0.4,
            margins: {
                top: 0,
                right: 0,
                bottom: 25,
                left: 30,
            },
            xAxisFontMultiplier: 0.04,
        };

        /**
         * Creates instance of BarChart. This method is only called once.
         *
         * @constructor
         * @param {VisualConstructorOptions} options - Contains references to the element that will
         *                                             contain the visual and a reference to the host
         *                                             which contains services.
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.element = options.element;
            this.selectionManager = options.host.createSelectionManager();

            this.selectionManager.registerOnSelectCallback(() => {
                this.syncSelectionState(this.barSelection, this.selectionManager.getSelectionIds() as ISelectionId[]);
            });

            this.tooltipServiceWrapper = createTooltipServiceWrapper(this.host.tooltipService, options.element);
            debugger;
            this.svg = d3.select(options.element)
                .append('svg')
                .classed('barChart', true);

            this.locale = options.host.locale;

            this.barContainer = this.svg
                .append('g')
                .classed('barContainer', true);

            this.xAxis = this.svg
                .append('g')
                .classed('xAxis', true);

            const helpLinkElement: Element = this.createHelpLinkElement();
            options.element.appendChild(helpLinkElement);

            this.helpLinkElement = d3.select(helpLinkElement);

            const bugBashElement: Element = this.createBugBashElementHook();
            bugBashElement.setAttribute("id","bugBashHook")
            options.element.appendChild(bugBashElement);

            this.bugBashElement = d3.select(bugBashElement);
        }

        /**
         * Updates the state of the visual. Every sequential databinding and resize will call update.
         *
         * @function
         * @param {VisualUpdateOptions} options - Contains references to the size of the container
         *                                        and the dataView which contains all the data
         *                                        the visual had queried.
         */
        public update(options: VisualUpdateOptions) {
            let viewModel: BarChartViewModel = visualTransform(options, this.host);
            let settings = this.barChartSettings = viewModel.settings;
            this.barDataPoints = viewModel.dataPoints;

            // Turn on landing page in capabilities and remove comment to turn on landing page!
            // this.HandleLandingPage(options);

            let width = options.viewport.width;
            let height = options.viewport.height;

            this.svg.attr({
                width: width,
                height: height
            });

            if (settings.enableAxis.show) {
                let margins = BarChart.Config.margins;
                height -= margins.bottom;
            }

            this.bugBashElement
                .classed("hidden", !settings.generalView.showBugBashData)

            this.helpLinkElement
                .classed("hidden", !settings.generalView.showHelpLink)
                .style({
                    "border-color": settings.generalView.helpLinkColor,
                    "color": settings.generalView.helpLinkColor,
                });

            this.xAxis.style({
                "font-size": d3.min([height, width]) * BarChart.Config.xAxisFontMultiplier,
                "fill": settings.enableAxis.fill,
            });

            let yScale = d3.scale.linear()
                .domain([0, viewModel.dataMax])
                .range([height, 0]);

            let xScale = d3.scale.ordinal()
                .domain(viewModel.dataPoints.map(d => d.category))
                .rangeRoundBands([0, width], BarChart.Config.xScalePadding, 0.2);

            let xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

            this.xAxis.attr('transform', 'translate(0, ' + height + ')')
                .call(xAxis);

            this.barSelection = this.barContainer
                .selectAll('.bar')
                .data(this.barDataPoints);

            this.barSelection
                .enter()
                .append('rect')
                .classed('bar', true);

            const opacity: number = viewModel.settings.generalView.opacity / 100;

            this.barSelection
                .attr({
                    width: xScale.rangeBand(),
                    height: d => height - yScale(<number>d.value),
                    y: d => yScale(<number>d.value),
                    x: d => xScale(d.category),
                })
                .style({
                    'fill-opacity': opacity,
                    'stroke-opacity': opacity,
                    fill: (dataPoint: BarChartDataPoint) => dataPoint.color,
                    stroke: (dataPoint: BarChartDataPoint) => dataPoint.strokeColor,
                    "stroke-width": (dataPoint: BarChartDataPoint) => `${dataPoint.strokeWidth}px`,
                });

            this.tooltipServiceWrapper.addTooltip(this.barContainer.selectAll('.bar'),
                (tooltipEvent: TooltipEventArgs<BarChartDataPoint>) => this.getTooltipData(tooltipEvent.data),
                (tooltipEvent: TooltipEventArgs<BarChartDataPoint>) => tooltipEvent.data.selectionId
            );

            this.syncSelectionState(
                this.barSelection,
                this.selectionManager.getSelectionIds() as ISelectionId[]
            );

            this.barSelection.on('click', (d) => {
                // Allow selection only if the visual is rendered in a view that supports interactivity (e.g. Report)
                if (this.host.allowInteractions) {
                    const isCtrlPressed: boolean = (d3.event as MouseEvent).ctrlKey;

                    this.selectionManager
                        .select(d.selectionId, isCtrlPressed)
                        .then((ids: ISelectionId[]) => {
                            this.syncSelectionState(this.barSelection, ids);
                        });

                    (<Event>d3.event).stopPropagation();
                }
            });

            this.barSelection
                .exit()
                .remove();

            // Clear selection when clicking outside a bar
            this.svg.on('click', (d) => {
                if (this.host.allowInteractions) {
                    this.selectionManager
                        .clear()
                        .then(() => {
                            this.syncSelectionState(this.barSelection, []);
                        });
                }
            });
            // handle context menu
            this.svg.on('contextmenu', () => {
                const mouseEvent: MouseEvent = d3.event as MouseEvent;
                const eventTarget: EventTarget = mouseEvent.target;
                let dataPoint = d3.select(eventTarget).datum();
                this.selectionManager.showContextMenu(dataPoint ? dataPoint.selectionId : {}, {
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY
                });
                mouseEvent.preventDefault();
            });

            //BugBash info
            this.updateBugBashElement();
        }

        private syncSelectionState(
            selection: d3.Selection<BarChartDataPoint>,
            selectionIds: ISelectionId[]
        ): void {
            if (!selection || !selectionIds) {
                return;
            }

            if (!selectionIds.length) {
                selection.style({
                    "fill-opacity": null,
                    "stroke-opacity": null,
                });

                return;
            }

            const self: this = this;

            selection.each(function (barDataPoint: BarChartDataPoint) {
                const isSelected: boolean = self.isSelectionIdInArray(selectionIds, barDataPoint.selectionId);

                const opacity: number = isSelected
                    ? BarChart.Config.solidOpacity
                    : BarChart.Config.transparentOpacity;

                d3.select(this).style({
                    "fill-opacity": opacity,
                    "stroke-opacity": opacity,
                });
            });
        }

        private isSelectionIdInArray(selectionIds: ISelectionId[], selectionId: ISelectionId): boolean {
            if (!selectionIds || !selectionId) {
                return false;
            }

            return selectionIds.some((currentSelectionId: ISelectionId) => {
                return currentSelectionId.includes(selectionId);
            });
        }

        /**
         * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
         *
         * @function
         * @param {EnumerateVisualObjectInstancesOptions} options - Map of defined objects
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            switch (objectName) {
                case 'enableAxis':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.barChartSettings.enableAxis.show,
                            fill: this.barChartSettings.enableAxis.fill,
                        },
                        selector: null
                    });
                    break;
                case 'colorSelector':
                    for (let barDataPoint of this.barDataPoints) {
                        objectEnumeration.push({
                            objectName: objectName,
                            displayName: barDataPoint.category,
                            properties: {
                                fill: {
                                    solid: {
                                        color: barDataPoint.color
                                    }
                                }
                            },
                            selector: barDataPoint.selectionId.getSelector()
                        });
                    }
                    break;
                case 'generalView':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            opacity: this.barChartSettings.generalView.opacity,
                            showBugBashData: this.barChartSettings.generalView.showBugBashData,
                            showHelpLink: this.barChartSettings.generalView.showHelpLink,
                            specialEnumeration: this.barChartSettings.generalView.specialEnumeration
                        },
                        validValues: {
                            opacity: {
                                numberRange: {
                                    min: 10,
                                    max: 100
                                }
                            }
                        },
                        selector: null
                    });
                    break;
                case 'testAnalyticsProperty':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.barChartSettings.testAnalyticsProperty.show,
                            displayName: this.barChartSettings.testAnalyticsProperty.displayName,
                            opacity: this.barChartSettings.testAnalyticsProperty.opacity,
                            showHelpLink: this.barChartSettings.testAnalyticsProperty.showHelpLink,
                            specialEnumeration: this.barChartSettings.testAnalyticsProperty.specialEnumeration
                        },
                        validValues: {
                            opacity: {
                                numberRange: {
                                    min: 10,
                                    max: 100
                                }
                            }
                        },
                        selector: null
                    });
                    break;
                case 'CardWithManyPropertiesAnalytics':
                objectEnumeration.push({
                    objectName: objectName,
                    properties: {
                        show: this.barChartSettings.CardWithManyPropertiesAnalytics.show,
                        displayName: this.barChartSettings.CardWithManyPropertiesAnalytics.displayName,
                        unboundIntegerProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.unboundIntegerProperty,
                        boundIntegerProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.boundIntegerProperty,
                        unboundNumericProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.unboundNumericProperty,
                        boundNumericProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.boundNumericProperty,
                        booleanProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.booleanProperty,
                        textProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.textProperty,
                        specialEnumeration: this.barChartSettings.CardWithManyPropertiesAnalytics.specialEnumeration,
                        colorProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.colorProperty,
                        nullableColorProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.nullableColorProperty,
                        formattingLableDisplayUnitsProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.formattingLableDisplayUnitsProperty,
                        formattingAlignmentProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.formattingAlignmentProperty,
                        formattingFontSizeProperty: this.barChartSettings.CardWithManyPropertiesAnalytics.formattingFontSizeProperty
                    },
                    validValues: {
                        boundIntegerProperty: {
                            numberRange: {
                                min: 10,
                                max: 100
                            }
                        },
                        boundNumericProperty: {
                            numberRange: {
                                min: 0,
                                max: 100
                            }
                        },
                        formattingFontSizeProperty :{
                            numberRange: {
                                min: 8,
                                max: 40
                            }
                        }
                    },
                    selector: null
                });
                break;
                case 'CardWithManyPropertiesFormatting':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.barChartSettings.CardWithManyPropertiesFormatting.show,
                            displayName: this.barChartSettings.CardWithManyPropertiesFormatting.displayName,
                            unboundIntegerProperty: this.barChartSettings.CardWithManyPropertiesFormatting.unboundIntegerProperty,
                            boundIntegerProperty: this.barChartSettings.CardWithManyPropertiesFormatting.boundIntegerProperty,
                            unboundNumericProperty: this.barChartSettings.CardWithManyPropertiesFormatting.unboundNumericProperty,
                            boundNumericProperty: this.barChartSettings.CardWithManyPropertiesFormatting.boundNumericProperty,
                            booleanProperty: this.barChartSettings.CardWithManyPropertiesFormatting.booleanProperty,
                            textProperty: this.barChartSettings.CardWithManyPropertiesFormatting.textProperty,
                            specialEnumeration: this.barChartSettings.CardWithManyPropertiesFormatting.specialEnumeration,
                            colorProperty: this.barChartSettings.CardWithManyPropertiesFormatting.colorProperty,
                            nullableColorProperty: this.barChartSettings.CardWithManyPropertiesFormatting.nullableColorProperty,
                            formattingLableDisplayUnitsProperty: this.barChartSettings.CardWithManyPropertiesFormatting.formattingLableDisplayUnitsProperty,
                            formattingAlignmentProperty: this.barChartSettings.CardWithManyPropertiesFormatting.formattingAlignmentProperty,
                            formattingFontSizeProperty: this.barChartSettings.CardWithManyPropertiesFormatting.formattingFontSizeProperty
                        },
                        validValues: {
                            boundIntegerProperty: {
                                numberRange: {
                                    min: 10,
                                    max: 100
                                }
                            },
                            boundNumericProperty: {
                                numberRange: {
                                    min: 0,
                                    max: 100
                                }
                            },
                            formattingFontSizeProperty :{
                                numberRange: {
                                    min: 8,
                                    max: 40
                                }
                            }
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }

        /**
         * Destroy runs when the visual is removed. Any cleanup that the visual needs to
         * do should be done here.
         *
         * @function
         */
        public destroy(): void {
            // Perform any cleanup tasks here
        }

        private getTooltipData(value: any): VisualTooltipDataItem[] {
            let language = getLocalizedString(this.locale, "LanguageKey");
            return [{
                displayName: value.category,
                value: value.value.toString(),
                color: value.color,
                header: language && "displayed language " + language
            }];
        }

        private createHelpLinkElement(): Element {
            let linkElement = document.createElement("a");
            linkElement.textContent = "?";
            linkElement.setAttribute("title", "Open documentation");
            linkElement.setAttribute("class", "helpLink");
            linkElement.addEventListener("click", () => {
                this.host.launchUrl("https://microsoft.github.io/PowerBI-visuals/tutorials/building-bar-chart/adding-url-launcher-element-to-the-bar-chart/");
            });
            return linkElement;
        };

        private createBugBashElementHook(): Element {
            let bugBashHookElement = document.createElement("div");
            bugBashHookElement.setAttribute("class","bugBashHook");
            bugBashHookElement.innerText = "bugBash data not populated yet. If this is unexpected, check for errors/bugs.";

            return bugBashHookElement;
        }

        private updateBugBashElement(): void {
            let bugBashHook = document.getElementById("bugBashHook");
            bugBashHook.innerText = "Bug Bash Data:";
            d3.select("table.bugBashTable").remove();

            let tableElement = document.createElement("table");
            tableElement.setAttribute("class","bugBashTable");
            //header row
            let headerRow = document.createElement("tr");
            let propertyNameHeader = document.createElement("th");
            propertyNameHeader.innerText = "Property";
            headerRow.appendChild(propertyNameHeader);
            
            let formatHeader = document.createElement("th");
            formatHeader.innerText = "Format";
            headerRow.appendChild(formatHeader);

            let analyticsNameHeader = document.createElement("th");
            analyticsNameHeader.innerText = "Analytics";
            headerRow.appendChild(analyticsNameHeader);

            tableElement.appendChild(headerRow);

            //data rows
            for(var property in this.barChartSettings.CardWithManyPropertiesAnalytics) {
                let currRow = document.createElement("tr");
                let propertyNameCell = document.createElement("td");
                propertyNameCell.innerText = property;
                currRow.appendChild(propertyNameCell);

                let formatCell = document.createElement("td");
                formatCell.innerText = JSON.stringify(this.barChartSettings.CardWithManyPropertiesFormatting[property]);
                currRow.appendChild(formatCell);

                let analyticsNameCell = document.createElement("td");
                analyticsNameCell.innerText = JSON.stringify(this.barChartSettings.CardWithManyPropertiesAnalytics[property]);
                currRow.appendChild(analyticsNameCell);

                tableElement.appendChild(currRow);
            }
            
            bugBashHook.appendChild(tableElement);
        };
        private HandleLandingPage(options: VisualUpdateOptions) {
            if (!options.dataViews || !options.dataViews.length) {
                if (!this.isLandingPageOn) {
                    this.isLandingPageOn = true;
                    const SampleLandingPage: Element = this.createSampleLandingPage();
                    this.element.appendChild(SampleLandingPage);

                    this.LandingPage = d3.select(SampleLandingPage);
                }

            } else {
                    if (this.isLandingPageOn && !this.LandingPageRemoved) {
                        this.LandingPageRemoved = true;
                        this.LandingPage.remove();
                }
            }
        }

        private createSampleLandingPage(): Element {
            let div = document.createElement("div");

            let header = document.createElement("h1");
            header.textContent = "Sample Bar Chart Landing Page";
            header.setAttribute("class", "LandingPage");
            let p1 = document.createElement("a");
            p1.setAttribute("class", "LandingPageHelpLink");
            p1.textContent = "Learn more about Landing page";

            p1.addEventListener("click", () => {
                this.host.launchUrl("https://microsoft.github.io/PowerBI-visuals/docs/overview/");
            });

            div.appendChild(header);
            div.appendChild(p1);

            return div;
        }
    }
}
