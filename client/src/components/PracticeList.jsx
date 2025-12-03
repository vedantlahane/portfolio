import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

const PracticeList = () => {
  const STORAGE_KEY = 'practice-statuses-v1';
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null); // For scroll-sync
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusMap, setStatusMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const sectionRefs = useRef([]);
  const topicButtonRefs = useRef([]);
  const rightSideRef = useRef(null);

  const sections = [
    {
      title: 'Time Complexity Questions',
      items: [
        { id: 'time-1', title: 'GeeksforGeeks - Time Complexity Practice', url: 'https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/' },
        { id: 'time-2', title: 'InterviewBit - Time Complexity Problems', url: 'https://www.interviewbit.com/courses/programming/time-complexity#problems' }
      ],
    },
    {
      title: 'Sorting',
      items: [
        { id: 'sort-1', title: 'Smaller Than the Current Number', url: 'https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/' },
        { id: 'sort-2', title: 'Monk and Nice Strings', url: 'https://www.hackerearth.com/practice/algorithms/sorting/insertion-sort/practice-problems/algorithm/monk-and-nice-strings-3/' },
        { id: 'sort-3', title: 'Merge Sorted Array', url: 'https://leetcode.com/problems/merge-sorted-array/' },
        { id: 'sort-4', title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/description/' },
        { id: 'sort-5', title: 'Inversion of Array (GfG)', url: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1' },
        { id: 'sort-6', title: 'Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { id: 'sort-7', title: 'Squares of a Sorted Array', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/description/' },
        { id: 'sort-8', title: 'Rotate Array by N Elements (GfG)', url: 'https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1' },
        { id: 'sort-9', title: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/description/' }
      ],
    },
    {
      title: 'More Sorting',
      items: [
        { id: 'sort-10', title: 'Reverse Pairs', url: 'https://leetcode.com/problems/reverse-pairs/description/' },
        { id: 'sort-11', title: 'Largest Number', url: 'https://leetcode.com/problems/largest-number/description/' },
        { id: 'sort-12', title: 'Sort Characters By Frequency', url: 'https://leetcode.com/problems/sort-characters-by-frequency/description/' },
      ]
    },
    {
      title: 'Array and 2D Array',
      items: [
        { id: 'array-1', title: 'Kadane (GfG)', url: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1' },
        { id: 'array-2', title: 'Max Sum Circular Subarray (LeetCode)', url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/description/' },
        { id: 'array-3', title: 'CSES - Maximum Subarray', url: 'https://cses.fi/problemset/task/1069' },
        { id: 'array-4', title: 'Max Consecutive Ones', url: 'https://leetcode.com/problems/max-consecutive-ones/' },
        { id: 'array-5', title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
        { id: 'array-6', title: 'Two Sum II - Sorted', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
        { id: 'array-7', title: '3Sum', url: 'https://leetcode.com/problems/3sum/description/' },
        { id: 'array-8', title: '4Sum', url: 'https://leetcode.com/problems/4sum/description/' },
        { id: 'array-9', title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/' },
        { id: 'array-10', title: 'First Element Occurring K Times (GfG)', url: 'https://www.geeksforgeeks.org/first-element-occurring-k-times-array/' },
        { id: 'array-11', title: 'Max Distance Between Same Elements (GfG)', url: 'https://practice.geeksforgeeks.org/problems/max-distance-between-same-elements/1' },
        { id: 'array-12', title: 'Maximum Difference Between Two Elements (GfG)', url: 'https://www.geeksforgeeks.org/maximum-difference-between-two-elements/' },
        { id: 'array-13', title: 'In First But Second (GfG)', url: 'https://practice.geeksforgeeks.org/problems/in-first-but-second5423/1' },
        { id: 'array-14', title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/' },
        { id: 'array-15', title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/' },
        { id: 'array-16', title: 'Move Zeroes', url: 'https://leetcode.com/problems/move-zeroes/' },
        { id: 'array-17', title: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
        { id: 'array-18', title: 'Find Pivot Index', url: 'https://leetcode.com/problems/find-pivot-index/description/' },
        { id: 'array-19', title: 'Running Sum of 1D Array', url: 'https://leetcode.com/problems/running-sum-of-1d-array/' },
        { id: 'array-20', title: 'Longest Distinct Characters (GfG)', url: 'https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1' },
        { id: 'array-21', title: 'Range Sum Query - Immutable', url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
        { id: 'array-22', title: 'Union of Two Sorted Arrays (GfG)', url: 'https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1' },
        { id: 'array-23', title: 'Rotate Array', url: 'https://leetcode.com/problems/rotate-array/description/' },
        { id: 'array-24', title: 'Majority Element (Boyer-Moore)', url: 'https://leetcode.com/problems/majority-element/description/' },
        { id: 'array-25', title: 'Rearrange Array Elements by Sign', url: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/description/' },
        { id: 'array-26', title: 'Next Permutation', url: 'https://leetcode.com/problems/next-permutation/description/' },
        { id: 'array-27', title: 'Leaders in an Array (GfG)', url: 'https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1' },
        { id: 'array-28', title: 'Set Matrix Zeroes', url: 'https://leetcode.com/problems/set-matrix-zeroes/description/' },
        { id: 'array-29', title: 'Rotate Image', url: 'https://leetcode.com/problems/rotate-image/description/' },
        { id: 'array-30', title: 'Pascals Triangle', url: 'https://leetcode.com/problems/pascals-triangle/description/' },
        { id: 'array-31', title: 'Missing Number', url: 'https://leetcode.com/problems/missing-number/description/' },
        { id: 'array-32', title: 'Number of Sub-arrays of Size K and Average >= Threshold', url: 'https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/description/' },
        { id: 'array-33', title: 'Maximal Rectangle', url: 'https://leetcode.com/problems/maximal-rectangle/description/' },
        { id: 'array-34', title: 'Zigzag Conversion', url: 'https://leetcode.com/problems/zigzag-conversion/description/' },
        { id: 'array-35', title: 'Greatest Sum Divisible by Three', url: 'https://leetcode.com/problems/greatest-sum-divisible-by-three/description/' },
        { id: 'array-36', title: 'First Missing Positive', url: 'https://leetcode.com/problems/first-missing-positive/description/' },
        { id: 'array-37', title: 'Find All Duplicates in an Array', url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/description/' },
        { id: 'array-38', title: 'Find All Numbers Disappeared in an Array', url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/' },
        { id: 'array-39', title: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/description/' },
        { id: 'array-40', title: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/description/' },
        { id: 'array-41', title: 'Queries on a Matrix (GfG)', url: 'https://www.geeksforgeeks.org/problems/queries-on-a-matrix0443/1' },
        { id: 'array-42', title: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/' }
      ],
    },
    {
      title: 'Linked List',
      items: [
        { id: 'll-1', title: 'Linked List Insertion (GfG)', url: 'https://practice.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1' },
        { id: 'll-2', title: 'Count Nodes of Linked List', url: 'https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1' },
        { id: 'll-3', title: 'Middle of the Linked List', url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
        { id: 'll-4', title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/' },
        { id: 'll-5', title: 'Remove Nth Node From End', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
        { id: 'll-6', title: 'Delete Node in a Linked List', url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
        { id: 'll-7', title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/' },
        { id: 'll-8', title: 'Linked List Cycle II', url: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
        { id: 'll-9', title: 'Add Two Numbers Linked List (GfG)', url: 'https://practice.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1' },
        { id: 'll-10', title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
        { id: 'll-11', title: 'Palindrome Linked List', url: 'https://leetcode.com/problems/palindrome-linked-list/' },
        { id: 'll-12', title: 'Reorder List', url: 'https://leetcode.com/problems/reorder-list/' },
        { id: 'll-13', title: 'Add Two Numbers II', url: 'https://leetcode.com/problems/add-two-numbers-ii/' },
        { id: 'll-14', title: 'Intersection of Two Linked Lists', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists' },
        { id: 'll-15', title: 'Remove Duplicates from a Sorted Linked List (GfG)', url: 'https://www.geeksforgeeks.org/remove-duplicates-from-a-sorted-linked-list/' }
      ],
    },
    {
      title: 'More Linked List',
      items: [
        { id: 'll-16', title: 'Rotate List', url: 'https://leetcode.com/problems/rotate-list/description/' },
        { id: 'll-17', title: 'LRU Cache', url: 'https://leetcode.com/problems/lru-cache/' },
        { id: 'll-18', title: 'Copy List with Random Pointer', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
        { id: 'll-19', title: 'Merge K Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/description/' }
      ]
    },
    {
      title: 'Stacks',
      items: [
        { id: 'stack-1', title: 'Remove Adjacent Duplicates in String II', url: 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/' },
        { id: 'stack-2', title: 'Remove Adjacent Duplicates in String', url: 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/' },
        { id: 'stack-3', title: 'Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/' },
        { id: 'stack-4', title: 'Next Larger Element (GfG)', url: 'https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1' },
        { id: 'stack-5', title: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/' },
        { id: 'stack-6', title: 'Maximal Rectangle', url: 'https://leetcode.com/problems/maximal-rectangle/description/' }
      ],
    },
    {
      title: 'More Stacks',
      items: [
        { id: 'stack-7', title: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
        { id: 'stack-8', title: 'Design a Stack With Increment Operation', url: 'https://leetcode.com/problems/design-a-stack-with-increment-operation/description/' }
      ]
    },
    {
      title: 'Queue + Deque',
      items: [
        { id: 'q-1', title: 'Queue using Two Stacks (GfG)', url: 'https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1' },
        { id: 'q-2', title: 'Design Front Middle Back Queue', url: 'https://leetcode.com/problems/design-front-middle-back-queue/description/' },
        { id: 'q-3', title: 'First Negative in Every Window', url: 'https://practice.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1' },
        { id: 'q-4', title: 'First Non-Repeating Character in a Stream', url: 'https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream1216/1' },
        { id: 'q-5', title: 'Max Consecutive Ones III', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
        { id: 'q-6', title: 'Sliding Window Maximum', url: 'https://leetcode.com/problems/sliding-window-maximum/description/' }
      ],
    },
    {
      title: 'HashMap',
      items: [
        { id: 'hash-1', title: 'Largest subarray with 0 sum', url: 'https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1' },
        { id: 'hash-2', title: 'Longest subarray with sum k (GfG)', url: 'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1' },
        { id: 'hash-3', title: 'Subarray Sum Equals K', url: 'https://leetcode.com/problems/subarray-sum-equals-k/description/' },
        { id: 'hash-4', title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/description/' }
      ],
    },
    {
      title: 'Strings',
      items: [
        { id: 'str-1', title: 'Palindromic Substrings', url: 'https://leetcode.com/problems/palindromic-substrings/' },
        { id: 'str-2', title: 'Reverse Words in a String III', url: 'https://leetcode.com/problems/reverse-words-in-a-string-iii/' },
        { id: 'str-3', title: 'Find Index of First Occurrence in a String', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/' }
      ],
    },
    {
      title: 'Binary Search',
      items: [
        { id: 'bs-1', title: 'Sqrt(x)', url: 'https://leetcode.com/problems/sqrtx/description/' },
        { id: 'bs-2', title: 'First and Last Position of Element in Sorted Array', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
        { id: 'bs-3', title: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' }
      ],
    },
    {
      title: 'Maths/Number Theory',
      items: [
        { id: 'math-1', title: 'Count Primes', url: 'https://leetcode.com/problems/count-primes/description/' },
        { id: 'math-2', title: 'Find GCD of Array', url: 'https://leetcode.com/problems/find-greatest-common-divisor-of-array/description/' }
      ],
    },
    {
      title: 'Trees',
      items: [
        { id: 'tree-1', title: 'Binary Tree Inorder Preorder Postorder', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/' },
        { id: 'tree-2', title: 'Level Order Traversal (GfG)', url: 'https://www.geeksforgeeks.org/problems/preorder-traversal/1' },
        { id: 'tree-3', title: 'Same Tree', url: 'https://leetcode.com/problems/same-tree/' }
      ],
    },
    {
      title: 'Bit Manipulation',
      items: [
        { id: 'bit-1', title: 'Single Number', url: 'https://leetcode.com/problems/single-number/description/' },
        { id: 'bit-2', title: 'Counting Bits', url: 'https://leetcode.com/problems/counting-bits/' }
      ],
    },
    {
      title: 'Greedy',
      items: [
        { id: 'greedy-1', title: 'Activity Selection (GfG)', url: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1' },
        { id: 'greedy-2', title: 'Job Sequencing (GfG)', url: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' }
      ],
    },
    {
      title: 'Dynamic Programming (DP)',
      items: [
        { id: 'dp-1', title: 'Max Sum Without Adjacents (GfG)', url: 'https://practice.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1' },
        { id: 'dp-2', title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/' }
      ],
    },
    {
      title: 'Heaps',
      items: [
        { id: 'heap-1', title: 'Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { id: 'heap-2', title: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/' }
      ],
    },
    {
      title: 'Graphs',
      items: [
        { id: 'graph-1', title: 'Number of Provinces', url: 'https://leetcode.com/problems/number-of-provinces/description/' },
        { id: 'graph-2', title: 'Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/description/' }
      ],
    },
    {
      title: 'Recursion and Backtracking',
      items: [
        { id: 'rec-1', title: 'Power of Four', url: 'https://leetcode.com/problems/power-of-four/description/' },
        { id: 'rec-2', title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/description/' },
        { id: 'rec-3', title: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/' },
        { id: 'rec-4', title: 'Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/' },
        { id: 'rec-5', title: 'Subset Sums (GfG)', url: 'https://practice.geeksforgeeks.org/problems/subset-sums2234/1' },
        { id: 'rec-6', title: 'Sudoku Solver', url: 'https://leetcode.com/problems/sudoku-solver/' },
        { id: 'rec-7', title: 'Count Ways to Reach Nth Stair (GfG)', url: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/' },
        { id: 'rec-8', title: 'Permutations', url: 'https://leetcode.com/problems/permutations/' },
        { id: 'rec-9', title: 'Min Cost Climbing Stairs', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
        { id: 'rec-10', title: 'Pow(x, n)', url: 'https://leetcode.com/problems/powx-n/description/' },
        { id: 'rec-11', title: 'Power of Two', url: 'https://leetcode.com/problems/power-of-two/description/' },
        { id: 'rec-12', title: 'Find the Winner of the Circular Game', url: 'https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/' },
        { id: 'rec-13', title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/description/' },
        { id: 'rec-14', title: 'Subsets', url: 'https://leetcode.com/problems/subsets/' },
        { id: 'rec-15', title: 'Letter Combinations of a Phone Number', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
        { id: 'rec-16', title: 'Sum of All Subset XOR Totals', url: 'https://leetcode.com/problems/sum-of-all-subset-xor-totals/' },
        { id: 'rec-17', title: 'Palindrome Partitioning', url: 'https://leetcode.com/problems/palindrome-partitioning/description/' },
        { id: 'rec-18', title: 'Rat in a Maze (GfG)', url: 'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
        { id: 'rec-19', title: 'Word Search', url: 'https://leetcode.com/problems/word-search/description/' },
        { id: 'rec-20', title: 'Subsets II', url: 'https://leetcode.com/problems/subsets-ii/description/' },
        { id: 'rec-21', title: 'Combination Sum II', url: 'https://leetcode.com/problems/combination-sum-ii/description/' },
        { id: 'rec-22', title: 'N-Queens II', url: 'https://leetcode.com/problems/n-queens-ii/description/' },
        { id: 'rec-23', title: 'Tower of Hanoi (GfG)', url: 'https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1' },
        { id: 'rec-24', title: 'Count Good Numbers', url: 'https://leetcode.com/problems/count-good-numbers/' },
        { id: 'rec-25', title: 'Sort a Stack (GfG)', url: 'https://www.geeksforgeeks.org/problems/sort-a-stack/1' },
        { id: 'rec-26', title: 'Combination Sum III', url: 'https://leetcode.com/problems/combination-sum-iii/description/' },
        { id: 'rec-27', title: 'String to Integer (atoi)', url: 'https://leetcode.com/problems/string-to-integer-atoi/description/' },
        { id: 'rec-28', title: 'All Unique Permutations (InterviewBit)', url: 'https://www.interviewbit.com/problems/all-unique-permutations/' },
        { id: 'rec-29', title: 'Kth Permutation Sequence (InterviewBit)', url: 'https://www.interviewbit.com/problems/kth-permutation-sequence/' },
        { id: 'rec-30', title: 'Restore IP Addresses', url: 'https://leetcode.com/problems/restore-ip-addresses/description/' },
        { id: 'rec-31', title: 'Word Break II', url: 'https://leetcode.com/problems/word-break-ii/description/' },
        { id: 'rec-32', title: 'Count Numbers with Unique Digits', url: 'https://leetcode.com/problems/count-numbers-with-unique-digits/' },
        { id: 'rec-33', title: 'Palindromic Substrings', url: 'https://leetcode.com/problems/palindromic-substrings/' }
      ],
    },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStatusMap(JSON.parse(saved));
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  // Scroll-sync: Detect which section is currently visible
  useEffect(() => {
    if (selectedTopic !== null) return; // Don't auto-sync when manually filtered

    const handleScroll = () => {
      if (!rightSideRef.current || sectionRefs.current.length === 0) return;

      const container = rightSideRef.current;
      const scrollTop = container.scrollTop;
      const containerTop = container.getBoundingClientRect().top;

      // Find which section is currently most visible
      let currentActive = 0;
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const section = sectionRefs.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top - containerTop;

          // If section is in view (with some offset)
          if (sectionTop <= 150) {
            currentActive = i;
          }
        }
      }

      setActiveTopic(currentActive);
    };

    const rightSide = rightSideRef.current;
    if (rightSide) {
      rightSide.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (rightSide) {
        rightSide.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedTopic]);

  // Auto-scroll sidebar when active topic changes
  useEffect(() => {
    if (activeTopic !== null && topicButtonRefs.current[activeTopic]) {
      const button = topicButtonRefs.current[activeTopic];
      button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeTopic]);

  // Calculate stats per topic
  const topicStats = useMemo(() => {
    return sections.map(sec => {
      const total = sec.items.length;
      let done = 0;
      sec.items.forEach(item => {
        if ((statusMap[item.id] || STATUS.TODO) === STATUS.DONE) done++;
      });
      return { total, done, progress: total > 0 ? (done / total) * 100 : 0 };
    });
  }, [statusMap, sections]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const flat = sections.flatMap((s) => s.items.map((it) => it.id));
    const total = flat.length;
    let todo = 0, inProgress = 0, done = 0;
    for (const id of flat) {
      const s = statusMap[id] || STATUS.TODO;
      if (s === STATUS.TODO) todo += 1;
      else if (s === STATUS.IN_PROGRESS) inProgress += 1;
      else if (s === STATUS.DONE) done += 1;
    }
    return { total, todo, inProgress, done, progress: total > 0 ? (done / total) * 100 : 0 };
  }, [statusMap, sections]);

  // Get all items for display
  const allSections = useMemo(() => {
    return sections.map((sec, secIndex) => {
      let items = sec.items;

      // Apply search filter
      if (searchQuery) {
        items = items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== 'All') {
        items = items.filter(item =>
          (statusMap[item.id] || STATUS.TODO) === statusFilter
        );
      }

      // Hide completed if toggled
      if (!showCompleted) {
        items = items.filter(item =>
          (statusMap[item.id] || STATUS.TODO) !== STATUS.DONE
        );
      }

      return { ...sec, items, originalIndex: secIndex };
    }).filter(sec => sec.items.length > 0);
  }, [sections, searchQuery, statusFilter, statusMap, showCompleted]);

  const handleStatusChange = (id, newStatus) => {
    const newMap = { ...statusMap, [id]: newStatus };
    setStatusMap(newMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
  };

  const handleReset = () => {
    if (confirm('Reset all practice progress?')) {
      localStorage.removeItem(STORAGE_KEY);
      setStatusMap({});
    }
  };

  const handleTopicClick = (index) => {
    setSelectedTopic(selectedTopic === index ? null : index);
    // Scroll to section
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickMarkDone = (sectionIndex) => {
    const sec = sections[sectionIndex];
    const newMap = { ...statusMap };
    sec.items.forEach(item => {
      newMap[item.id] = STATUS.DONE;
    });
    setStatusMap(newMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 border-t border-gray-200">
      {/* Left Sidebar - Topics */}
      <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {/* NEW: Moving Header Container on top of Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 lg:mb-8 lg:sticky lg:top-0 bg-white z-10"
          >
            {/* Header */}
            <div className="mb-8">
              <p className="text-xs sm:text-sm text-gray-400 font-mono font-light mb-6">
                TOPICS
              </p>

              {/* Overall Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-sans">Overall Progress</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {overallStats.done}/{overallStats.total}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gray-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallStats.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['All', STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded transition-all duration-200 font-sans ${statusFilter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Toggle Completed */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`text-xs px-3 py-1.5 rounded transition-all duration-200 font-sans ${showCompleted
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-900 text-white'
                    }`}
                >
                  {showCompleted ? 'Hide Completed' : 'Show Completed'}
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="text-xs px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-sans w-full"
              >
                Reset Progress
              </button>
            </div>
          </motion.div>

          {/* Topic List */}
          <div className="space-y-1">
            {sections.map((sec, index) => {
              const isActive = selectedTopic === null ? activeTopic === index : selectedTopic === index;
              return (
                <motion.div
                  key={sec.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 * index }}
                >
                  <button
                    ref={(el) => (topicButtonRefs.current[index] = el)}
                    onClick={() => handleTopicClick(index)}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {/* Arrow indicator - pushes content to right when active */}
                      {isActive && (
                        <span className="text-sm font-mono text-gray-900">
                          →
                        </span>
                      )}
                      <span className="text-xs font-mono text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-sans flex-1 transition-colors duration-200 ${isActive ? 'text-gray-900 font-medium' : ''
                        }`}>{sec.title}</span>
                      <span className="text-xs font-mono text-gray-500">
                        {topicStats[index].done}/{topicStats[index].total}
                      </span>
                    </div>
                    {topicStats[index].progress > 0 && (
                      <div className={`h-1 bg-gray-200 rounded-full overflow-hidden transition-all duration-200 ${isActive ? 'ml-8' : 'ml-6'
                        }`}>
                        <div
                          className="h-full bg-gray-900 transition-all duration-300"
                          style={{ width: `${topicStats[index].progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                  {isActive && topicStats[index].done < topicStats[index].total && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickMarkDone(index);
                      }}
                      className="ml-12 mt-1 text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-sans"
                    >
                      Mark all done
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Practice Items */}
      <div
        ref={rightSideRef}
        className="col-span-1 lg:col-span-5 bg-gray-50 lg:h-screen lg:overflow-y-auto"
      >
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {allSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 font-sans">No items match the current filter</p>
            </div>
          ) : (
            allSections.map((sec, displayIndex) => (
              <div
                key={sec.title}
                ref={(el) => (sectionRefs.current[sec.originalIndex] = el)}
                className="mb-12 last:mb-0"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">
                      {String(sec.originalIndex + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-base font-medium text-gray-900 font-sans uppercase tracking-wide">
                      {sec.title}
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {sec.items.length} ITEMS
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-0">
                  {sec.items.map((item, index) => {
                    const status = statusMap[item.id] || STATUS.TODO;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 * index }}
                        className="group border-b border-gray-200 last:border-b-0 py-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-700 hover:text-gray-900 font-sans transition-all duration-200 inline-block group-hover:translate-x-1"
                          >
                            {item.title}
                          </a>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                          >
                            <option value={STATUS.TODO}>{STATUS.TODO}</option>
                            <option value={STATUS.IN_PROGRESS}>{STATUS.IN_PROGRESS}</option>
                            <option value={STATUS.DONE}>{STATUS.DONE}</option>
                          </select>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded ${status === STATUS.DONE
                              ? 'bg-green-50 text-green-700'
                              : status === STATUS.IN_PROGRESS
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-50 text-gray-600'
                              }`}
                          >
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${status === STATUS.DONE ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                            {status}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeList;
