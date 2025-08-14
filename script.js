// Algorithm Visualizer - Main JavaScript File

class AlgorithmVisualizer {
    constructor() {
        this.array = [];
        this.arraySize = 50;
        this.animationSpeed = 100; // milliseconds
        this.isSorting = false;
        this.currentAlgorithm = 'bubble';
        
        // Algorithm information
        this.algorithmInfo = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Selection Sort divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Insertion Sort builds the final sorted array one item at a time, inserting each element into its correct position.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Merge Sort divides the array into halves, sorts them separately, and then merges the sorted halves back together.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)'
            }
        };

        this.initializeEventListeners();
        this.generateArray();
        this.updateAlgorithmInfo();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Algorithm selection
        document.getElementById('algorithm-select').addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            this.updateAlgorithmInfo();
        });

        // Array size control
        document.getElementById('array-size').addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            document.getElementById('size-value').textContent = this.arraySize;
            if (!this.isSorting) {
                this.generateArray();
            }
        });

        // Speed control
        document.getElementById('speed-control').addEventListener('input', (e) => {
            const speedValue = parseInt(e.target.value);
            const speedLabels = ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
            const speedValues = [300, 200, 100, 50, 10];
            
            this.animationSpeed = speedValues[speedValue - 1];
            document.getElementById('speed-value').textContent = speedLabels[speedValue - 1];
        });

        // Control buttons
        document.getElementById('generate-array').addEventListener('click', () => {
            if (!this.isSorting) {
                this.generateArray();
            }
        });

        document.getElementById('start-sort').addEventListener('click', () => {
            if (!this.isSorting) {
                this.startSorting();
            }
        });
    }

    // Generate a new random array
    generateArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 350) + 10);
        }
        this.renderArray();
        this.updateStatus('Ready to sort');
    }

    // Render the array as bars
    renderArray() {
        const container = document.getElementById('array-container');
        container.innerHTML = '';

        const containerWidth = container.clientWidth - 40; // Account for padding
        const barWidth = Math.max(3, Math.floor(containerWidth / this.arraySize) - 2);

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value}px`;
            bar.style.width = `${barWidth}px`;
            bar.id = `bar-${index}`;
            
            // Add value label
            const valueLabel = document.createElement('span');
            valueLabel.className = 'bar-value';
            valueLabel.textContent = value;
            bar.appendChild(valueLabel);
            
            container.appendChild(bar);
        });
    }

    // Update algorithm information display
    updateAlgorithmInfo() {
        const info = this.algorithmInfo[this.currentAlgorithm];
        document.getElementById('algo-name').textContent = info.name;
        document.getElementById('algo-description').textContent = info.description;
        document.getElementById('time-complexity').textContent = info.timeComplexity;
        document.getElementById('space-complexity').textContent = info.spaceComplexity;
    }

    // Update status message
    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    // Start the sorting process
    async startSorting() {
        this.isSorting = true;
        this.disableControls();
        this.updateStatus('Sorting...');

        try {
            switch (this.currentAlgorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
                case 'merge':
                    await this.mergeSort(0, this.array.length - 1);
                    break;
                case 'quick':
                    await this.quickSort(0, this.array.length - 1);
                    break;
            }

            // Mark all bars as sorted
            await this.markAllSorted();
            this.updateStatus('Sorting completed!');
        } catch (error) {
            console.error('Sorting error:', error);
            this.updateStatus('Sorting interrupted');
        }

        this.isSorting = false;
        this.enableControls();
    }

    // Bubble Sort Algorithm
    async bubbleSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Highlight bars being compared
                await this.highlightBars([j, j + 1], 'comparing');
                
                if (this.array[j] > this.array[j + 1]) {
                    // Highlight bars being swapped
                    await this.highlightBars([j, j + 1], 'swapping');
                    
                    // Swap elements
                    await this.swapElements(j, j + 1);
                }
                
                // Remove highlighting
                await this.removeBarsHighlight([j, j + 1]);
            }
            
            // Mark the last element as sorted
            await this.markBarSorted(n - 1 - i);
        }
        
        // Mark the first element as sorted
        await this.markBarSorted(0);
    }

    // Selection Sort Algorithm
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            // Highlight current minimum
            await this.highlightBars([minIndex], 'comparing');
            
            for (let j = i + 1; j < n; j++) {
                // Highlight current element being compared
                await this.highlightBars([j], 'comparing');
                
                if (this.array[j] < this.array[minIndex]) {
                    // Remove old minimum highlighting
                    await this.removeBarsHighlight([minIndex]);
                    minIndex = j;
                    // Highlight new minimum
                    await this.highlightBars([minIndex], 'comparing');
                } else {
                    // Remove highlighting from current element
                    await this.removeBarsHighlight([j]);
                }
                
                await this.sleep(this.animationSpeed / 2);
            }
            
            if (minIndex !== i) {
                // Highlight bars being swapped
                await this.highlightBars([i, minIndex], 'swapping');
                await this.swapElements(i, minIndex);
            }
            
            // Remove highlighting and mark as sorted
            await this.removeBarsHighlight([i, minIndex]);
            await this.markBarSorted(i);
        }
        
        // Mark the last element as sorted
        await this.markBarSorted(n - 1);
    }

    // Insertion Sort Algorithm
    async insertionSort() {
        const n = this.array.length;
        
        // Mark first element as sorted
        await this.markBarSorted(0);
        
        for (let i = 1; i < n; i++) {
            let key = this.array[i];
            let j = i - 1;
            
            // Highlight the key element
            await this.highlightBars([i], 'comparing');
            
            while (j >= 0 && this.array[j] > key) {
                // Highlight comparison
                await this.highlightBars([j, j + 1], 'swapping');
                
                // Shift element
                this.array[j + 1] = this.array[j];
                await this.updateBarHeight(j + 1, this.array[j + 1]);
                
                j--;
                await this.sleep(this.animationSpeed);
            }
            
            // Insert the key at correct position
            this.array[j + 1] = key;
            await this.updateBarHeight(j + 1, key);
            
            // Remove highlighting
            await this.removeBarsHighlight([i, j + 1]);
            
            // Mark inserted element as sorted
            await this.markBarSorted(i);
        }
    }

    // Merge Sort Algorithm
    async mergeSort(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSort(left, mid);
            await this.mergeSort(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }

    // Merge function for Merge Sort
    async merge(left, mid, right) {
        const leftArray = this.array.slice(left, mid + 1);
        const rightArray = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArray.length && j < rightArray.length) {
            // Highlight elements being compared
            await this.highlightBars([k], 'comparing');
            
            if (leftArray[i] <= rightArray[j]) {
                this.array[k] = leftArray[i];
                await this.updateBarHeight(k, leftArray[i]);
                i++;
            } else {
                this.array[k] = rightArray[j];
                await this.updateBarHeight(k, rightArray[j]);
                j++;
            }
            
            await this.removeBarsHighlight([k]);
            k++;
        }
        
        // Copy remaining elements
        while (i < leftArray.length) {
            await this.highlightBars([k], 'swapping');
            this.array[k] = leftArray[i];
            await this.updateBarHeight(k, leftArray[i]);
            await this.removeBarsHighlight([k]);
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            await this.highlightBars([k], 'swapping');
            this.array[k] = rightArray[j];
            await this.updateBarHeight(k, rightArray[j]);
            await this.removeBarsHighlight([k]);
            j++;
            k++;
        }
    }

    // Quick Sort Algorithm
    async quickSort(low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSort(low, pivotIndex - 1);
            await this.quickSort(pivotIndex + 1, high);
        }
    }

    // Partition function for Quick Sort
    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;
        
        // Highlight pivot
        await this.highlightBars([high], 'pivot');
        
        for (let j = low; j < high; j++) {
            // Highlight current element
            await this.highlightBars([j], 'comparing');
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    await this.highlightBars([i, j], 'swapping');
                    await this.swapElements(i, j);
                }
            }
            
            await this.removeBarsHighlight([j]);
        }
        
        // Place pivot in correct position
        if (i + 1 !== high) {
            await this.highlightBars([i + 1, high], 'swapping');
            await this.swapElements(i + 1, high);
        }
        
        await this.removeBarsHighlight([i + 1, high]);
        return i + 1;
    }

    // Utility function to highlight bars
    async highlightBars(indices, className) {
        indices.forEach(index => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) {
                bar.classList.add(className);
            }
        });
        await this.sleep(this.animationSpeed);
    }

    // Utility function to remove highlighting from bars
    async removeBarsHighlight(indices) {
        indices.forEach(index => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) {
                bar.classList.remove('comparing', 'swapping', 'pivot');
            }
        });
    }

    // Utility function to mark a bar as sorted
    async markBarSorted(index) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.classList.remove('comparing', 'swapping', 'pivot');
            bar.classList.add('sorted');
        }
        await this.sleep(this.animationSpeed / 2);
    }

    // Utility function to mark all bars as sorted
    async markAllSorted() {
        for (let i = 0; i < this.array.length; i++) {
            await this.markBarSorted(i);
        }
    }

    // Utility function to swap two elements
    async swapElements(i, j) {
        // Swap in array
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        
        // Update bar heights
        await this.updateBarHeight(i, this.array[i]);
        await this.updateBarHeight(j, this.array[j]);
        
        await this.sleep(this.animationSpeed);
    }

    // Utility function to update bar height
    async updateBarHeight(index, value) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.style.height = `${value}px`;
            const valueLabel = bar.querySelector('.bar-value');
            if (valueLabel) {
                valueLabel.textContent = value;
            }
        }
    }

    // Utility function to create delay
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Disable controls during sorting
    disableControls() {
        document.getElementById('algorithm-select').disabled = true;
        document.getElementById('array-size').disabled = true;
        document.getElementById('generate-array').disabled = true;
        document.getElementById('start-sort').disabled = true;
    }

    // Enable controls after sorting
    enableControls() {
        document.getElementById('algorithm-select').disabled = false;
        document.getElementById('array-size').disabled = false;
        document.getElementById('generate-array').disabled = false;
        document.getElementById('start-sort').disabled = false;
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});

// Handle window resize to adjust bar widths
window.addEventListener('resize', () => {
    const visualizer = window.algorithmVisualizer;
    if (visualizer && !visualizer.isSorting) {
        visualizer.renderArray();
    }
});