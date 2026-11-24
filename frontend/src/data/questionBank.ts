import { TechnicalQuestion } from '../types';

export const COMPREHENSIVE_TECHNICAL_QUESTIONS: TechnicalQuestion[] = [
  // ==========================================
  // 1. PYTHON (10+ Questions)
  // ==========================================
  {
    id: 'py-1',
    category: 'Python',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the primary difference between a List and a Tuple in Python?',
    options: [
      'Lists are immutable, Tuples are mutable',
      'Lists are mutable, Tuples are immutable',
      'Tuples cannot store integers',
      'Lists are faster than Tuples'
    ],
    correctAnswer: 1,
    explanation: 'Lists in Python are mutable (their contents can be modified), whereas Tuples are immutable (cannot be changed after creation).'
  },
  {
    id: 'py-2',
    category: 'Python',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which built-in Python function returns the number of items in an object?',
    options: ['count()', 'length()', 'len()', 'size()'],
    correctAnswer: 2,
    explanation: 'The `len()` function returns the number of items in a list, tuple, string, dictionary, or set.'
  },
  {
    id: 'py-3',
    category: 'Python',
    difficulty: 'Easy',
    type: 'short',
    question: 'Explain what `*args` and `**kwargs` mean in Python function definitions.',
    explanation: '`*args` allows a function to accept any number of positional arguments as a tuple, while `**kwargs` accepts any number of keyword arguments as a dictionary.'
  },
  {
    id: 'py-4',
    category: 'Python',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What will be the output of `[x for x in range(10) if x % 2 == 0]`?',
    options: ['[1, 3, 5, 7, 9]', '[0, 2, 4, 6, 8]', '[2, 4, 6, 8, 10]', '[0, 1, 2, 3, 4]'],
    correctAnswer: 1,
    explanation: 'List comprehension generates even integers from 0 up to (and excluding) 10: `[0, 2, 4, 6, 8]`.'
  },
  {
    id: 'py-5',
    category: 'Python',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain what Python decorators are and give a practical use case.',
    explanation: 'A decorator is a design pattern in Python used to extend or modify the behavior of a function without directly changing its code. Practical use cases include logging, authentication checking, caching, and execution timer decorators.'
  },
  {
    id: 'py-6',
    category: 'Python',
    difficulty: 'Medium',
    type: 'coding',
    question: 'Write a Python function `two_sum(nums, target)` that returns indices of the two numbers such that they add up to `target`.',
    starterCode: `def two_sum(nums, target):
    # Write your solution here
    pass`,
    testCases: [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { input: '[3, 2, 4], 6', expected: '[1, 2]' }
    ],
    explanation: 'Using a hashmap to store complement values achieves an optimal O(n) time complexity.'
  },
  {
    id: 'py-7',
    category: 'Python',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is the difference between shallow copy and deep copy in Python `copy` module?',
    explanation: 'A shallow copy constructs a new object but inserts references to objects found in the original. A deep copy recursively constructs a new object and duplicates child objects.'
  },
  {
    id: 'py-8',
    category: 'Python',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Python Global Interpreter Lock (GIL) and how it affects multi-threaded vs multi-processing performance.',
    explanation: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once. For CPU-bound tasks, multiprocessing or C extensions are preferred over multithreading.'
  },
  {
    id: 'py-9',
    category: 'Python',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Python Generators, the `yield` keyword, and how memory efficiency compares to returning lists.',
    explanation: 'Generators create iterators that compute values lazily on-demand using `yield`, keeping memory footprint O(1) instead of allocating an entire list in RAM.'
  },
  {
    id: 'py-10',
    category: 'Python',
    difficulty: 'Hard',
    type: 'coding',
    question: 'Write a generator function `fibonacci_gen(n)` that yields the first `n` numbers in the Fibonacci sequence.',
    starterCode: `def fibonacci_gen(n):
    # Write your generator here
    pass`,
    testCases: [{ input: '6', expected: '[0, 1, 1, 2, 3, 5]' }],
    explanation: 'Yielding values one-by-one generates terms in O(1) memory space.'
  },

  // ==========================================
  // 2. JAVA (10+ Questions)
  // ==========================================
  {
    id: 'java-1',
    category: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which concept in Java prevents a class from being inherited?',
    options: ['static', 'final', 'abstract', 'volatile'],
    correctAnswer: 1,
    explanation: 'Marking a class with the `final` keyword in Java prevents it from being extended by any subclass.'
  },
  {
    id: 'java-2',
    category: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the default initial capacity of an ArrayList in Java?',
    options: ['5', '10', '16', '20'],
    correctAnswer: 1,
    explanation: 'An ArrayList in Java has a default initial capacity of 10 elements.'
  },
  {
    id: 'java-3',
    category: 'Java',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is the difference between JDK, JRE, and JVM?',
    explanation: 'JDK is the full development kit (compiler + JRE). JRE is the runtime environment (libraries + JVM). JVM is the virtual machine that executes bytecode.'
  },
  {
    id: 'java-4',
    category: 'Java',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is the difference between String, StringBuilder, and StringBuffer in Java?',
    explanation: 'String is immutable. StringBuilder is mutable but not thread-safe (fast). StringBuffer is mutable and thread-safe (synchronized).'
  },
  {
    id: 'java-5',
    category: 'Java',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which interface in Java Collection Framework does NOT inherit from java.util.Collection?',
    options: ['List', 'Set', 'Map', 'Queue'],
    correctAnswer: 2,
    explanation: '`Map` is a key-value mapping structure and does not extend the `Collection` root interface.'
  },
  {
    id: 'java-6',
    category: 'Java',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Method Overloading vs Method Overriding in Java.',
    explanation: 'Overloading happens in the same class (same method name, different parameters, compile-time). Overriding happens in subclass (same signature, runtime polymorphism).'
  },
  {
    id: 'java-7',
    category: 'Java',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain how Java Garbage Collection works and compare G1GC with ZGC.',
    explanation: 'Garbage Collection automatically reclaims unreferenced heap memory. G1GC divides memory into regions for predictable pauses, while ZGC achieves sub-millisecond low-latency pauses.'
  },
  {
    id: 'java-8',
    category: 'Java',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is the Java Memory Model (JMM) and what is the role of `volatile` keyword?',
    explanation: 'JMM defines thread memory interactions. `volatile` guarantees visibility of variable reads/writes across threads by bypassing CPU caches.'
  },
  {
    id: 'java-9',
    category: 'Java',
    difficulty: 'Hard',
    type: 'coding',
    question: 'Write a Java method `boolean isPalindrome(String s)` that checks if a string is palindrome ignoring case and alphanumeric characters.',
    starterCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`,
    testCases: [{ input: '"A man, a plan, a canal: Panama"', expected: 'true' }],
    explanation: 'Two-pointer comparison after stripping non-alphanumeric characters.'
  },
  {
    id: 'java-10',
    category: 'Java',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the time complexity of put() and get() in Java HashMap in best/average case?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Average O(1) constant time due to hash buckets. In worst case (collisions), Java 8 transforms buckets into red-black trees O(log n).'
  },

  // ==========================================
  // 3. C / C++ (10+ Questions)
  // ==========================================
  {
    id: 'cpp-1',
    category: 'C/C++',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is a pointer in C/C++?',
    options: [
      'A variable that holds integer data',
      'A variable that stores the memory address of another variable',
      'A function call mechanism',
      'A data structure'
    ],
    correctAnswer: 1,
    explanation: 'A pointer stores the memory address of another variable in RAM.'
  },
  {
    id: 'cpp-2',
    category: 'C/C++',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is the difference between malloc() in C and new operator in C++?',
    explanation: '`malloc()` allocates raw uninitialized memory bytes without calling constructors. `new` allocates memory and automatically invokes object constructors.'
  },
  {
    id: 'cpp-3',
    category: 'C/C++',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which header file is required to use `std::vector` in C++?',
    options: ['<array>', '<vector>', '<list>', '<stl>'],
    correctAnswer: 1,
    explanation: '`<vector>` contains the dynamic array container definition in C++ STL.'
  },
  {
    id: 'cpp-4',
    category: 'C/C++',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain what a Virtual Function is in C++ and how VTABLE operates.',
    explanation: 'A virtual function enables dynamic (runtime) dispatch. The compiler maintains a VTABLE (array of function pointers) for classes with virtual functions.'
  },
  {
    id: 'cpp-5',
    category: 'C/C++',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What happens if you delete a void pointer in C++?',
    options: [
      'It causes undefined behavior because destructors won\'t be called',
      'Memory is freed normally',
      'Compiler error occurs',
      'It creates a memory leak automatically'
    ],
    correctAnswer: 0,
    explanation: 'Deleting a void pointer prevents destructors from executing, causing undefined behavior.'
  },
  {
    id: 'cpp-6',
    category: 'C/C++',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Smart Pointers in C++11 (std::unique_ptr, std::shared_ptr, std::weak_ptr).',
    explanation: 'Smart pointers manage object lifetime via RAII. `unique_ptr` has single ownership, `shared_ptr` uses reference counting, and `weak_ptr` avoids circular references.'
  },
  {
    id: 'cpp-7',
    category: 'C/C++',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Move Semantics and rvalue references (`&&`) in Modern C++.',
    explanation: 'Move semantics transfer ownership of underlying resources from temporary rvalues without deep copying buffers.'
  },
  {
    id: 'cpp-8',
    category: 'C/C++',
    difficulty: 'Hard',
    type: 'coding',
    question: 'Write a C++ function `void reverseArray(int arr[], int n)` to reverse an array in-place.',
    starterCode: `#include <iostream>

void reverseArray(int arr[], int n) {
    // Write your solution here
}`,
    testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '5 1' }],
    explanation: 'Two-pointer swapping in O(n) time and O(1) space.'
  },
  {
    id: 'cpp-9',
    category: 'C/C++',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is diamond problem in C++ multiple inheritance and how is it resolved?',
    options: [
      'Resolved using virtual inheritance',
      'Resolved using static methods',
      'Resolved using templates',
      'Cannot be resolved in C++'
    ],
    correctAnswer: 0,
    explanation: 'Virtual base classes (`class B : virtual public A`) prevent duplicate base subobjects in derived classes.'
  },
  {
    id: 'cpp-10',
    category: 'C/C++',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is RAII (Resource Acquisition Is Initialization) in C++?',
    explanation: 'RAII binds resource allocation (memory, file handles, sockets) to object lifespan, ensuring destructor auto-cleanup on scope exit.'
  },

  // ==========================================
  // 4. DATA STRUCTURES (10+ Questions)
  // ==========================================
  {
    id: 'dsa-1',
    category: 'Data Structures',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'In a balanced BST, height is log(n), making search O(log n).'
  },
  {
    id: 'dsa-2',
    category: 'Data Structures',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which data structure operates on LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'LinkedList', 'Tree'],
    correctAnswer: 1,
    explanation: 'Stack works on Last In First Out (LIFO).'
  },
  {
    id: 'dsa-3',
    category: 'Data Structures',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is the difference between Array and LinkedList?',
    explanation: 'Array elements are contiguous in memory with O(1) index access. LinkedList nodes contain pointers, dynamically allocated across memory.'
  },
  {
    id: 'dsa-4',
    category: 'Data Structures',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain how a LRU (Least Recently Used) Cache is implemented using Hash Map and Doubly Linked List.',
    explanation: 'Hash Map gives O(1) key access; Doubly Linked List maintains insertion/usage order for O(1) eviction.'
  },
  {
    id: 'dsa-5',
    category: 'Data Structures',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What data structure is used in Breadth-First Search (BFS) graph traversal?',
    options: ['Stack', 'Queue', 'Priority Queue', 'Tree'],
    correctAnswer: 1,
    explanation: 'BFS uses a Queue to visit nodes level-by-level.'
  },
  {
    id: 'dsa-6',
    category: 'Data Structures',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain the difference between a Min-Heap and a Max-Heap.',
    explanation: 'In Min-Heap, root is smaller than or equal to children. In Max-Heap, root is greater than or equal to children.'
  },
  {
    id: 'dsa-7',
    category: 'Data Structures',
    difficulty: 'Hard',
    type: 'coding',
    question: 'Write a Python function `reverse_linked_list(head)` to reverse a singly linked list.',
    starterCode: `class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    # Write your solution here
    pass`,
    testCases: [{ input: 'Node(1->2->3)', expected: '3' }],
    explanation: 'Iterative pointer reversing in O(n) time and O(1) space.'
  },
  {
    id: 'dsa-8',
    category: 'Data Structures',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is Trie (Prefix Tree) and where is it used?',
    explanation: 'Trie is a tree-like structure used for fast string prefix searching, auto-complete, and spell checking in O(L) time where L is word length.'
  },
  {
    id: 'dsa-9',
    category: 'Data Structures',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the height balance factor condition for an AVL Tree node?',
    options: ['-1, 0, or +1', '-2 to +2', 'Must equal 0', 'Greater than +1'],
    correctAnswer: 0,
    explanation: 'Height difference between left and right subtrees must be -1, 0, or +1.'
  },
  {
    id: 'dsa-10',
    category: 'Data Structures',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Disjoint Set Union (DSU) / Union-Find with Path Compression and Rank optimization.',
    explanation: 'DSU tracks partitioned sets. Path compression flattens tree height during find(), achieving near O(1) amortized time (inverse Ackermann function).'
  },

  // ==========================================
  // 5. ALGORITHMS (10+ Questions)
  // ==========================================
  {
    id: 'algo-1',
    category: 'Algorithms',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which sorting algorithm has a best-case time complexity of O(n) when array is already sorted?',
    options: ['QuickSort', 'MergeSort', 'Insertion Sort', 'Selection Sort'],
    correctAnswer: 2,
    explanation: 'Insertion sort performs linear scans O(n) when array is sorted.'
  },
  {
    id: 'algo-2',
    category: 'Algorithms',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is Binary Search and what is its prerequisite condition?',
    explanation: 'Binary Search repeatedly halves search range in O(log n) time. Prerequisite: array MUST be sorted.'
  },
  {
    id: 'algo-3',
    category: 'Algorithms',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is time complexity of MergeSort in all cases (worst, average, best)?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctAnswer: 1,
    explanation: 'MergeSort consistently runs in O(n log n) time across all cases.'
  },
  {
    id: 'algo-4',
    category: 'Algorithms',
    difficulty: 'Medium',
    type: 'short',
    question: 'How does QuickSort work and what is its worst-case time complexity?',
    explanation: 'QuickSort partitions around a pivot. Average time O(n log n), worst-case O(n²) when pivot selection is bad.'
  },
  {
    id: 'algo-5',
    category: 'Algorithms',
    difficulty: 'Medium',
    type: 'coding',
    question: 'Write a Python function `binary_search(nums, target)` that returns index of target or -1.',
    starterCode: `def binary_search(nums, target):
    # Write your solution here
    pass`,
    testCases: [{ input: '[1, 3, 5, 7, 9], 7', expected: '3' }],
    explanation: 'Halving search range achieves O(log n) performance.'
  },
  {
    id: 'algo-6',
    category: 'Algorithms',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Dynamic Programming vs Greedy Choice Strategy.',
    explanation: 'Greedy makes local optimal choices without looking back. Dynamic Programming solves overlapping subproblems by memoizing solutions.'
  },
  {
    id: 'algo-7',
    category: 'Algorithms',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Dijkstra\'s Shortest Path algorithm and how Min-Heap optimizes it to O((V + E) log V).',
    explanation: 'Min-Heap priority queue allows extracting minimum tentative distance vertex in O(log V) time.'
  },
  {
    id: 'algo-8',
    category: 'Algorithms',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Kadane\'s Algorithm for Maximum Subarray Sum in O(n) time.',
    explanation: 'Kadane tracks current max ending at index and global max, updating `max_ending_here = max(num, max_ending_here + num)`.'
  },
  {
    id: 'algo-9',
    category: 'Algorithms',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Which algorithm is used to detect negative weight cycles in a directed graph?',
    options: ['Dijkstra', 'Bellman-Ford', 'Kruskal', 'Prim'],
    correctAnswer: 1,
    explanation: 'Bellman-Ford handles negative edge weights and flags negative weight cycles.'
  },
  {
    id: 'algo-10',
    category: 'Algorithms',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Topological Sorting on Directed Acyclic Graphs (DAG) using Kahn\'s Algorithm (Indegree Array).',
    explanation: 'Kahn\'s algorithm computes in-degree for all vertices, pushes zero in-degree vertices into a Queue, and removes edges iteratively.'
  },

  // ==========================================
  // 6. SQL (10+ Questions)
  // ==========================================
  {
    id: 'sql-1',
    category: 'SQL',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which SQL clause is used to filter aggregate records after a GROUP BY?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'],
    correctAnswer: 1,
    explanation: '`HAVING` filters aggregated groups; `WHERE` filters individual rows prior to grouping.'
  },
  {
    id: 'sql-2',
    category: 'SQL',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which keyword removes duplicate rows from SQL query result set?',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'REMOVE'],
    correctAnswer: 1,
    explanation: '`SELECT DISTINCT` removes duplicate values from query results.'
  },
  {
    id: 'sql-3',
    category: 'SQL',
    difficulty: 'Easy',
    type: 'short',
    question: 'Explain the difference between INNER JOIN and LEFT JOIN.',
    explanation: 'INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from left table plus matched rows from right table (filling NULLs if missing).'
  },
  {
    id: 'sql-4',
    category: 'SQL',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is the difference between `DELETE`, `TRUNCATE`, and `DROP` in SQL?',
    explanation: 'DELETE is DML (deletes specific rows, can rollback). TRUNCATE is DDL (deletes all rows fast, resets identity). DROP deletes entire table schema.'
  },
  {
    id: 'sql-5',
    category: 'SQL',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which SQL Window Function ranks rows without gaps in ranking values?',
    options: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', 'LEAD()'],
    correctAnswer: 1,
    explanation: '`DENSE_RANK()` assigns consecutive rank values without leaving gaps on ties.'
  },
  {
    id: 'sql-6',
    category: 'SQL',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain SQL Subqueries (Correlated vs Uncorrelated Subquery).',
    explanation: 'Uncorrelated subquery runs independently once. Correlated subquery evaluates repeatedly for each row processed by outer query.'
  },
  {
    id: 'sql-7',
    category: 'SQL',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is Database Indexing and how do B-Trees optimize SQL query speed?',
    explanation: 'Indexes create balanced B-Tree structures mapping columns to disk pointers, reducing lookup complexity from O(n) table scan to O(log n).'
  },
  {
    id: 'sql-8',
    category: 'SQL',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is a Clustered Index vs Non-Clustered Index in SQL databases?',
    options: [
      'Clustered physically sorts data rows on disk (only 1 per table)',
      'Non-clustered physically sorts data rows on disk',
      'Both physically sort data rows on disk',
      'Clustered indexes cannot be created on primary keys'
    ],
    correctAnswer: 0,
    explanation: 'Clustered index defines physical data sorting order on disk (1 per table). Non-clustered index stores pointers to rows.'
  },
  {
    id: 'sql-9',
    category: 'SQL',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain SQL Windowing Functions `LAG()` and `LEAD()` with a practical case.',
    explanation: '`LAG()` fetches previous row value and `LEAD()` fetches subsequent row value without self-joining table.'
  },
  {
    id: 'sql-10',
    category: 'SQL',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is SQL Injection and how do Prepared Statements (Parameterized Queries) prevent it?',
    explanation: 'SQL Injection inserts malicious SQL code into input fields. Parameterized queries separate query logic from data input, treating user strings as literals.'
  },

  // ==========================================
  // 7. DBMS (10+ Questions)
  // ==========================================
  {
    id: 'dbms-1',
    category: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What does Primary Key guarantee in a Database table?',
    options: ['Uniqueness and NOT NULL', 'Allows NULL values', 'Can have duplicates', 'None'],
    correctAnswer: 0,
    explanation: 'Primary key uniquely identifies each record and prohibits NULL entries.'
  },
  {
    id: 'dbms-2',
    category: 'DBMS',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is Foreign Key in relational databases?',
    explanation: 'Foreign Key enforces referential integrity by linking a column to Primary Key of another table.'
  },
  {
    id: 'dbms-3',
    category: 'DBMS',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain the ACID properties in database management systems.',
    explanation: 'Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent execution), Durability (permanent commit).'
  },
  {
    id: 'dbms-4',
    category: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which isolation level prevents Dirty Reads but allows Non-Repeatable Reads?',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctAnswer: 1,
    explanation: '`Read Committed` ensures transactions only read committed data, preventing dirty reads.'
  },
  {
    id: 'dbms-5',
    category: 'DBMS',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain 1NF, 2NF, and 3NF Normalization.',
    explanation: '1NF removes multi-valued attributes. 2NF removes partial dependencies. 3NF removes transitive dependencies.'
  },
  {
    id: 'dbms-6',
    category: 'DBMS',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is Database Deadlock and how is Two-Phase Locking (2PL) used?',
    explanation: '2PL uses Growing phase (acquires locks) and Shrinking phase (releases locks) to guarantee serializability.'
  },
  {
    id: 'dbms-7',
    category: 'DBMS',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Database Normalization BCNF (Boyce-Codd Normal Form).',
    explanation: 'BCNF is a stricter 3NF where every determinant (X in X -> Y) MUST be a Candidate Key.'
  },
  {
    id: 'dbms-8',
    category: 'DBMS',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Write-Ahead Logging (WAL) in transaction recovery.',
    explanation: 'WAL records all changes to disk log before updating data pages, ensuring Durability and Atomicity recovery via UNDO/REDO.'
  },
  {
    id: 'dbms-9',
    category: 'DBMS',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is Sharding in database scaling?',
    options: [
      'Horizontal partitioning of database across multiple server nodes',
      'Vertical scaling adding RAM to single server',
      'Creating database indexes',
      'Database backup replication'
    ],
    correctAnswer: 0,
    explanation: 'Sharding distributes database rows horizontally across separate database server instances.'
  },
  {
    id: 'dbms-10',
    category: 'DBMS',
    difficulty: 'Hard',
    type: 'short',
    question: 'Compare SQL (Relational) vs NoSQL (Document/Key-Value) databases.',
    explanation: 'SQL features rigid schema, ACID compliance, and vertical scaling. NoSQL features dynamic JSON schemas, BASE consistency, and horizontal scaling.'
  },

  // ==========================================
  // 8. WEB DEVELOPMENT (10+ Questions)
  // ==========================================
  {
    id: 'web-1',
    category: 'Web Development',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'In React, what hook is used to handle side effects like data fetching or DOM updates?',
    options: ['useState', 'useContext', 'useEffect', 'useReducer'],
    correctAnswer: 2,
    explanation: '`useEffect` handles side-effects after component rendering.'
  },
  {
    id: 'web-2',
    category: 'Web Development',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is the Virtual DOM in React and why is it fast?',
    explanation: 'Virtual DOM is a lightweight in-memory representation. React diffs Virtual DOM with real DOM to batch efficient updates.'
  },
  {
    id: 'web-3',
    category: 'Web Development',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which HTTP method is idempotent and used to retrieve data from a server?',
    options: ['POST', 'GET', 'PATCH', 'DELETE'],
    correctAnswer: 1,
    explanation: '`GET` requests are safe, idempotent, and retrieve data without modifying server state.'
  },
  {
    id: 'web-4',
    category: 'Web Development',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is CORS (Cross-Origin Resource Sharing) and how do servers handle preflight requests?',
    explanation: 'CORS security mechanism sends HTTP OPTIONS preflight request to verify cross-origin access headers.'
  },
  {
    id: 'web-5',
    category: 'Web Development',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain the Event Loop in JavaScript (Call Stack, Task Queue, Microtask Queue).',
    explanation: 'Call stack executes synchronous JS. Promises/queueMicrotask enter Microtask Queue (processed first). setTimeout/DOM events enter Task Queue.'
  },
  {
    id: 'web-6',
    category: 'Web Development',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the purpose of `useMemo` hook in React?',
    options: [
      'Memoize expensive calculation results between renders',
      'Handle API requests',
      'Store component state',
      'Manage global context'
    ],
    correctAnswer: 0,
    explanation: '`useMemo` caches computed values unless dependencies change.'
  },
  {
    id: 'web-7',
    category: 'Web Development',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain SSR (Server-Side Rendering) vs SSG (Static Site Generation) vs ISR (Incremental Static Regeneration).',
    explanation: 'SSR renders HTML per request. SSG builds static pages at compile time. ISR revalidates static pages dynamically on background requests.'
  },
  {
    id: 'web-8',
    category: 'Web Development',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain WebSockets vs HTTP Long Polling vs Server-Sent Events (SSE).',
    explanation: 'WebSockets provide full-duplex TCP communication. SSE provides single-way server-to-client streaming. Long Polling repeatedly holds HTTP requests.'
  },
  {
    id: 'web-9',
    category: 'Web Development',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What security header protects against Cross-Site Scripting (XSS)?',
    options: ['Content-Security-Policy (CSP)', 'X-Frame-Options', 'Strict-Transport-Security', 'Access-Control-Allow-Origin'],
    correctAnswer: 0,
    explanation: '`Content-Security-Policy` restricts script origins to prevent inline XSS injection.'
  },
  {
    id: 'web-10',
    category: 'Web Development',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is JWT (JSON Web Token) authentication and how do signature headers prevent tampering?',
    explanation: 'JWT contains Header, Payload, and Signature. Server signs token with secret key. Tampering invalidates signature verification.'
  },

  // ==========================================
  // 9. OPERATING SYSTEMS (10+ Questions)
  // ==========================================
  {
    id: 'os-1',
    category: 'Operating Systems',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the main difference between a Process and a Thread?',
    options: [
      'Threads have isolated address spaces, processes share memory',
      'Processes have isolated memory spaces, threads within a process share memory',
      'Processes are faster to context switch than threads',
      'Threads cannot run concurrently'
    ],
    correctAnswer: 1,
    explanation: 'Processes have isolated memory spaces; threads within a process share memory and handle execution.'
  },
  {
    id: 'os-2',
    category: 'Operating Systems',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is Context Switching in OS?',
    explanation: 'Context switching saves CPU state of current process/thread and restores state of next process to run.'
  },
  {
    id: 'os-3',
    category: 'Operating Systems',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which CPU scheduling algorithm gives smallest average waiting time for given set of processes?',
    options: ['FCFS', 'Shortest Job First (SJF)', 'Round Robin', 'Priority Scheduling'],
    correctAnswer: 1,
    explanation: 'Shortest Job First (SJF) minimizes average waiting time.'
  },
  {
    id: 'os-4',
    category: 'Operating Systems',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is deadlock in Operating Systems and what are its four necessary conditions?',
    explanation: 'Deadlock occurs when processes block each other permanently. Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.'
  },
  {
    id: 'os-5',
    category: 'Operating Systems',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Virtual Memory and Paging.',
    explanation: 'Virtual Memory creates large address space illusion using secondary storage. Paging divides physical RAM into fixed-size frames and virtual memory into pages.'
  },
  {
    id: 'os-6',
    category: 'Operating Systems',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is Thrashing in Virtual Memory?',
    options: [
      'High page fault rate where OS spends more time swapping pages than executing code',
      'CPU running at 100% utilization',
      'Disk defragmentation process',
      'Thread synchronization deadlock'
    ],
    correctAnswer: 0,
    explanation: 'Thrashing occurs when OS constantly swaps pages back and forth due to insufficient physical RAM.'
  },
  {
    id: 'os-7',
    category: 'Operating Systems',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Semaphore vs Mutex for inter-process synchronization.',
    explanation: 'Mutex is a binary locking flag owned by single thread. Semaphore is a counting signal allowing N concurrent accesses.'
  },
  {
    id: 'os-8',
    category: 'Operating Systems',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Banker\'s Algorithm for Deadlock Avoidance.',
    explanation: 'Banker\'s Algorithm checks resource allocations dynamically to guarantee state remains safe before granting requests.'
  },
  {
    id: 'os-9',
    category: 'Operating Systems',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is TLB (Translation Lookaside Buffer)?',
    options: [
      'Hardware CPU cache storing recent virtual-to-physical memory address translations',
      'Disk cache for file systems',
      'Interrupt handler table',
      'Process scheduler queue'
    ],
    correctAnswer: 0,
    explanation: 'TLB is a fast hardware cache that accelerates virtual memory address translations.'
  },
  {
    id: 'os-10',
    category: 'Operating Systems',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Inode structure in Unix File Systems.',
    explanation: 'An Inode stores file metadata (permissions, owner, size, timestamps, block pointers to physical disk sectors).'
  },

  // ==========================================
  // 10. COMPUTER NETWORKS (10+ Questions)
  // ==========================================
  {
    id: 'net-1',
    category: 'Computer Networks',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'How many layers are in OSI Reference Model?',
    options: ['4', '5', '7', '9'],
    correctAnswer: 2,
    explanation: 'OSI Model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.'
  },
  {
    id: 'net-2',
    category: 'Computer Networks',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is the key difference between TCP and UDP?',
    explanation: 'TCP is connection-oriented, reliable, with handshake and error checking. UDP is connectionless, fast, without guarantee of packet delivery.'
  },
  {
    id: 'net-3',
    category: 'Computer Networks',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which port number is used by default for HTTPS?',
    options: ['80', '21', '443', '8080'],
    correctAnswer: 2,
    explanation: 'HTTPS encrypted traffic uses port 443; HTTP uses port 80.'
  },
  {
    id: 'net-4',
    category: 'Computer Networks',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain TCP Three-Way Handshake (SYN, SYN-ACK, ACK).',
    explanation: 'Client sends SYN. Server replies SYN-ACK. Client returns ACK to establish reliable connection.'
  },
  {
    id: 'net-5',
    category: 'Computer Networks',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is DNS (Domain Name System) and how does recursive resolution work?',
    explanation: 'DNS translates human names (example.com) to IP addresses (192.0.2.1) via Root, TLD, and Authoritative servers.'
  },
  {
    id: 'net-6',
    category: 'Computer Networks',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which layer of OSI model does IP (Internet Protocol) operate at?',
    options: ['Data Link', 'Network', 'Transport', 'Application'],
    correctAnswer: 1,
    explanation: 'IP operates at Network Layer (Layer 3) to route packets.'
  },
  {
    id: 'net-7',
    category: 'Computer Networks',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain TCP Congestion Control algorithms (Slow Start, Congestion Avoidance, Fast Retransmit).',
    explanation: 'Slow Start doubles congestion window exponentially. Congestion Avoidance increases linearly. Loss triggers window reduction.'
  },
  {
    id: 'net-8',
    category: 'Computer Networks',
    difficulty: 'Hard',
    type: 'short',
    question: 'What is ARP (Address Resolution Protocol) and how does it map IP to MAC address?',
    explanation: 'ARP broadcasts query asking "Who has IP X?". Node possessing IP replies with its 48-bit MAC address.'
  },
  {
    id: 'net-9',
    category: 'Computer Networks',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is subnet mask `/24` in IPv4 notation?',
    options: ['255.255.255.0', '255.255.0.0', '255.0.0.0', '255.255.255.255'],
    correctAnswer: 0,
    explanation: '`/24` indicates 24 network bits: 255.255.255.0 (allowing 254 hosts).'
  },
  {
    id: 'net-10',
    category: 'Computer Networks',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain TLS/SSL Handshake and how asymmetric key encryption exchanges symmetric session key.',
    explanation: 'Client/server verify digital certificates, perform key exchange (ECDHE/RSA) to generate a symmetric session key for fast AES encryption.'
  },

  // ==========================================
  // 11. OBJECT ORIENTED PROGRAMMING (OOP) (10+ Questions)
  // ==========================================
  {
    id: 'oop-1',
    category: 'OOP',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the main principle behind Polymorphism in OOP?',
    options: [
      'Hiding internal implementation details',
      'Creating a new class from existing class',
      'Providing a unified interface for different underlying data types/methods',
      'Restricting access to variables'
    ],
    correctAnswer: 2,
    explanation: 'Polymorphism allows objects of different classes to respond to same method invocation.'
  },
  {
    id: 'oop-2',
    category: 'OOP',
    difficulty: 'Easy',
    type: 'short',
    question: 'What are the 4 fundamental pillars of OOP?',
    explanation: 'Encapsulation, Abstraction, Inheritance, and Polymorphism.'
  },
  {
    id: 'oop-3',
    category: 'OOP',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which OOP concept hides complex implementation details and exposes only essential features?',
    options: ['Inheritance', 'Abstraction', 'Polymorphism', 'Composition'],
    correctAnswer: 1,
    explanation: 'Abstraction hides complexity and shows only relevant interface.'
  },
  {
    id: 'oop-4',
    category: 'OOP',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Encapsulation and how access modifiers (private, protected, public) enforce it.',
    explanation: 'Encapsulation bundles data and methods together, restricting direct variable access using private modifiers and getter/setter functions.'
  },
  {
    id: 'oop-5',
    category: 'OOP',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is the difference between Abstract Class and Interface?',
    explanation: 'Abstract class can have state fields and concrete method implementations. Interface defines pure contract behavior.'
  },
  {
    id: 'oop-6',
    category: 'OOP',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What design principle advocates "Composition over Inheritance"?',
    options: [
      'Has-A relationship flexibility over rigid Is-A hierarchy',
      'Always extend parent classes',
      'Avoid interfaces',
      'Use global variables'
    ],
    correctAnswer: 0,
    explanation: 'Composition (Has-A) decouples components better than rigid class inheritance trees.'
  },
  {
    id: 'oop-7',
    category: 'OOP',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain the SOLID principles in Object-Oriented Software Design.',
    explanation: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.'
  },
  {
    id: 'oop-8',
    category: 'OOP',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Singleton Design Pattern and how thread-safe Double-Checked Locking is implemented.',
    explanation: 'Singleton restricts instantiation to single instance. Double-checked locking uses volatile instance checks inside synchronized blocks.'
  },
  {
    id: 'oop-9',
    category: 'OOP',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Which Design Pattern defines a one-to-many dependency where state changes notify dependents?',
    options: ['Factory Pattern', 'Observer Pattern', 'Strategy Pattern', 'Adapter Pattern'],
    correctAnswer: 1,
    explanation: 'Observer pattern notifies subscribers automatically when subject state changes.'
  },
  {
    id: 'oop-10',
    category: 'OOP',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Factory Method Pattern vs Abstract Factory Pattern.',
    explanation: 'Factory Method uses method to create single product subclass. Abstract Factory produces families of related products.'
  },

  // ==========================================
  // 12. MACHINE LEARNING (10+ Questions)
  // ==========================================
  {
    id: 'ml-1',
    category: 'Machine Learning',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which type of Machine Learning uses labeled training datasets?',
    options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Clustering'],
    correctAnswer: 0,
    explanation: 'Supervised learning trains models on labeled input-output target pairs.'
  },
  {
    id: 'ml-2',
    category: 'Machine Learning',
    difficulty: 'Easy',
    type: 'short',
    question: 'What is Overfitting in Machine Learning models?',
    explanation: 'Overfitting occurs when a model learns noise in training data too closely, failing to generalize to new test data.'
  },
  {
    id: 'ml-3',
    category: 'Machine Learning',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which algorithm is commonly used for unsupervised data clustering?',
    options: ['Linear Regression', 'K-Means', 'Logistic Regression', 'Naive Bayes'],
    correctAnswer: 1,
    explanation: 'K-Means partitions unlabelled data points into K clusters based on distance centroids.'
  },
  {
    id: 'ml-4',
    category: 'Machine Learning',
    difficulty: 'Medium',
    type: 'short',
    question: 'Explain Bias-Variance Tradeoff in Machine Learning.',
    explanation: 'High Bias leads to underfitting (oversimplified model). High Variance leads to overfitting (overly sensitive to training noise).'
  },
  {
    id: 'ml-5',
    category: 'Machine Learning',
    difficulty: 'Medium',
    type: 'short',
    question: 'What is Precision, Recall, and F1-Score?',
    explanation: 'Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1-Score is harmonic mean balancing Precision and Recall.'
  },
  {
    id: 'ml-6',
    category: 'Machine Learning',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which activation function outputs values in range (0, 1) and is used for binary classification output layers?',
    options: ['ReLU', 'Sigmoid', 'Softmax', 'Tanh'],
    correctAnswer: 1,
    explanation: 'Sigmoid maps outputs to probability values between 0 and 1.'
  },
  {
    id: 'ml-7',
    category: 'Machine Learning',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Gradient Descent (Batch vs Stochastic vs Mini-Batch).',
    explanation: 'Gradient descent minimizes loss. Batch uses full dataset; Stochastic uses 1 sample; Mini-Batch uses small batches for stable vectorization.'
  },
  {
    id: 'ml-8',
    category: 'Machine Learning',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain L1 (Lasso) vs L2 (Ridge) Regularization.',
    explanation: 'L1 adds absolute coefficient weights penalty (forces zero weights for feature selection). L2 adds squared weights penalty.'
  },
  {
    id: 'ml-9',
    category: 'Machine Learning',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What mechanism in Transformer neural networks (e.g. GPT/BERT) allows parallel processing of sequence tokens?',
    options: ['Recurrent Cell', 'Self-Attention Mechanism', 'Convolutional Kernel', 'Pooling Layer'],
    correctAnswer: 1,
    explanation: 'Self-Attention computes pairwise token relationships in parallel across entire sequence.'
  },
  {
    id: 'ml-10',
    category: 'Machine Learning',
    difficulty: 'Hard',
    type: 'short',
    question: 'Explain Vanishing / Exploding Gradient problem in Deep Recurrent Neural Networks (RNN) and how LSTM solves it.',
    explanation: 'Unrolled RNN backpropagation causes gradients to shrink or explode exponentially. LSTM uses Cell State and Memory Gates (Input, Forget, Output) to preserve gradients over long time steps.'
  },

  // --- SOFTWARE ENGINEERING ---
  {
    id: 'se-1',
    category: 'Software Engineering',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which software development lifecycle (SDLC) model is characterized by sequential, linear phases where testing begins only after implementation?',
    options: ['Agile Scrum', 'Waterfall Model', 'Spiral Model', 'Kanban'],
    correctAnswer: 1,
    explanation: 'The Waterfall model is a classic linear sequential lifecycle where each phase (Requirements, Design, Implementation, Verification, Maintenance) must complete before the next starts.'
  },
  {
    id: 'se-2',
    category: 'Software Engineering',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the primary difference between Black-Box testing and White-Box testing?',
    options: [
      'Black-box tests code syntax, while White-box tests UI',
      'Black-box tests functionality without internal code knowledge, while White-box tests internal logic and paths',
      'White-box testing is performed exclusively by end users',
      'Black-box testing requires source code compilation'
    ],
    correctAnswer: 1,
    explanation: 'Black-box testing focuses on inputs and expected outputs without looking at internal source code structure. White-box testing verifies internal branch coverage and control flows.'
  },
  {
    id: 'se-3',
    category: 'Software Engineering',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In the SOLID design principles, what does the "Single Responsibility Principle" (SRP) state?',
    options: [
      'A class should have only one public method',
      'A software component should have only one reason to change',
      'A class should only implement a single interface',
      'Every program must have a single entry point'
    ],
    correctAnswer: 1,
    explanation: 'SRP states that a module, class, or function should have one, and only one, reason to change — meaning it should perform only one cohesive job.'
  },
  {
    id: 'se-4',
    category: 'Software Engineering',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which design pattern is best suited when you need to ensure a class has only one instance and provides a global point of access to it?',
    options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
    correctAnswer: 2,
    explanation: 'The Singleton pattern restricts the instantiation of a class to one single instance and provides a global access method (e.g. database connection pool, logger).'
  },
  {
    id: 'se-5',
    category: 'Software Engineering',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the primary purpose of continuous integration (CI) in modern DevOps pipelines?',
    options: [
      'Automatically deploying code straight to production without tests',
      'Automatically building, packaging, and testing code whenever a developer commits changes',
      'Generating end-user marketing documentation',
      'Replacing human developers with automated agents'
    ],
    correctAnswer: 1,
    explanation: 'Continuous Integration (CI) automatically builds and runs unit/integration tests whenever code is pushed to a shared repository, catching bugs immediately.'
  },

  // --- APTITUDE AND LOGICAL REASONING ---
  {
    id: 'apt-1',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'A train 150 meters long passes a standing pole in 15 seconds. What is the speed of the train in km/h?',
    options: ['30 km/h', '36 km/h', '45 km/h', '54 km/h'],
    correctAnswer: 1,
    explanation: 'Speed = Distance / Time = 150m / 15s = 10 m/s. Convert m/s to km/h by multiplying by (18/5): 10 * 18/5 = 36 km/h.'
  },
  {
    id: 'apt-2',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'If 12 workers can complete a project in 18 days, how many days will 9 workers take to complete the exact same project at the same rate?',
    options: ['20 days', '24 days', '22 days', '26 days'],
    correctAnswer: 1,
    explanation: 'Total man-days = 12 * 18 = 216. For 9 workers: Days = 216 / 9 = 24 days.'
  },
  {
    id: 'apt-3',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'A shopkeeper marks an item 30% above cost price and then gives a 10% discount on the marked price. What is the net profit percentage?',
    options: ['17%', '20%', '15%', '18%'],
    correctAnswer: 0,
    explanation: 'Let CP = 100. Marked Price = 130. Selling Price with 10% discount = 130 - 13 = 117. Net profit = 117 - 100 = 17%.'
  },
  {
    id: 'apt-4',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['125', '127', '129', '131'],
    correctAnswer: 1,
    explanation: 'Each term is (previous * 2) + 1: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1 = 127.'
  },
  {
    id: 'apt-5',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In a bag of 5 red and 4 black marbles, what is the probability of drawing 2 red marbles consecutively without replacement?',
    options: ['5/18', '10/36', '20/81', '25/81'],
    correctAnswer: 0,
    explanation: 'P(First Red) = 5/9. P(Second Red) = 4/8. P(Both Red) = (5/9) * (4/8) = (5/9) * (1/2) = 5/18.'
  },

  // --- ARTIFICIAL INTELLIGENCE ---
  {
    id: 'ai-1',
    category: 'Artificial Intelligence',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which search algorithm in AI is guaranteed to find the shortest path in an unweighted state space graph?',
    options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Linear Search', 'Hill Climbing'],
    correctAnswer: 1,
    explanation: 'Breadth-First Search (BFS) explores all neighbors level by level, ensuring that the first time the goal state is reached, it is via the path with the fewest edges.'
  },
  {
    id: 'ai-2',
    category: 'Artificial Intelligence',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In the A* Search algorithm, what condition must the heuristic function h(n) satisfy to guarantee finding an optimal solution?',
    options: [
      'It must always overestimate true remaining cost',
      'It must be admissible (never overestimate the true minimum cost to goal)',
      'It must evaluate strictly to zero',
      'It must be equal to the path cost g(n)'
    ],
    correctAnswer: 1,
    explanation: 'A* is guaranteed to be optimal if the heuristic h(n) is admissible (meaning h(n) <= true cost to goal from state n).'
  },
  {
    id: 'ai-3',
    category: 'Artificial Intelligence',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the purpose of the Minimax algorithm with Alpha-Beta pruning in game-playing AI (e.g. Chess or Tic-Tac-Toe)?',
    options: [
      'To generate random game moves',
      'To determine optimal game moves by assuming both players play rationally while eliminating non-promising branches',
      'To calculate neural network loss',
      'To cluster game pieces into color categories'
    ],
    correctAnswer: 1,
    explanation: 'Minimax chooses moves that maximize the player outcome assuming optimal opponent response. Alpha-Beta pruning discards branches that cannot influence the final decision, speeding up search.'
  },
  {
    id: 'ai-4',
    category: 'Artificial Intelligence',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What does RAG (Retrieval-Augmented Generation) do to improve responses from Large Language Models (LLMs)?',
    options: [
      'It retrains the foundational model weights from scratch on every user prompt',
      'It retrieves relevant document chunks from a vector database and includes them in the LLM context prompt',
      'It compresses neural network weights into 8-bit integers',
      'It disables token prediction in transformers'
    ],
    correctAnswer: 1,
    explanation: 'RAG queries a vector store for factual, domain-specific text and injects it into the prompt, reducing hallucination and eliminating constant model retraining.'
  },
  {
    id: 'ai-5',
    category: 'Artificial Intelligence',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the Turing Test designed to determine in artificial intelligence?',
    options: [
      'The processing clock speed of a microprocessor',
      'Whether a machine can exhibit human-equivalent conversational intelligence',
      'How much power a computer server consumes',
      'The accuracy of a sorting algorithm'
    ],
    correctAnswer: 1,
    explanation: 'Proposed by Alan Turing in 1950, the test evaluates whether an interrogator can distinguish between human and machine responses in text conversation.'
  },
  {
    id: 'ai-6',
    category: 'Artificial Intelligence',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In expert systems, what is the role of an "Inference Engine"?',
    options: [
      'To compile C++ programs into machine code',
      'To apply logical rules to the knowledge base to deduce new information or solutions',
      'To store user profile pictures',
      'To manage relational database backups'
    ],
    correctAnswer: 1,
    explanation: 'The inference engine is the brain of an expert system, executing forward or backward chaining on logical IF-THEN rules in the knowledge base.'
  },
  {
    id: 'ai-7',
    category: 'Artificial Intelligence',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the vanishing gradient problem in deep neural network training?',
    options: [
      'Weights explode to infinity during forward pass',
      'Gradients shrink exponentially as backpropagation passes through earlier layers, stalling learning in deep networks',
      'The learning rate is increased after each batch',
      'Neurons permanently output positive values only'
    ],
    correctAnswer: 1,
    explanation: 'In deep networks using saturating activations like sigmoid, multiplying small derivative values during backprop causes gradients in early layers to vanish toward zero. Solved by ReLU and Residual connections.'
  },

  // --- ADDITIONAL SOFTWARE ENGINEERING ---
  {
    id: 'se-6',
    category: 'Software Engineering',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What does the "S" stand for in SOLID object-oriented design principles?',
    options: [
      'Single Responsibility Principle (a class should have only one reason to change)',
      'System Scalability Principle',
      'Sequential Execution Principle',
      'Static Method Principle'
    ],
    correctAnswer: 0,
    explanation: 'Single Responsibility Principle states that every class or module should have responsibility over a single part of software functionality with only one reason to change.'
  },
  {
    id: 'se-7',
    category: 'Software Engineering',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the key purpose of Continuous Integration (CI) in modern software engineering?',
    options: [
      'To replace automated testing with manual reviews',
      'To automatically build and test code commits frequently in a shared repository to detect defects early',
      'To permanently prevent developers from creating git branches',
      'To increase software delivery latency'
    ],
    correctAnswer: 1,
    explanation: 'Continuous Integration automates the build, test, and static code verification pipeline whenever developers merge code into the shared main branch, preventing integration drift.'
  },
  {
    id: 'se-8',
    category: 'Software Engineering',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the difference between Black-box testing and White-box testing?',
    options: [
      'Black-box tests internal source code; White-box tests only color themes',
      'Black-box tests functionality without internal code knowledge; White-box tests internal logic, paths, and structure',
      'Black-box testing is done only in production environments',
      'White-box testing cannot use automated test runners'
    ],
    correctAnswer: 1,
    explanation: 'Black-box testing validates inputs and expected outputs against requirements without internal code awareness. White-box testing examines internal code flow, branches, and statements.'
  },
  {
    id: 'se-9',
    category: 'Software Engineering',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In the Circuit Breaker design pattern for microservices, what happens in the "Half-Open" state?',
    options: [
      'All incoming requests are immediately blocked without attempting execution',
      'A limited trial number of requests are allowed through to verify if the underlying downstream service has recovered',
      'The entire database cluster is restarted',
      'Network sockets are kept open indefinitely'
    ],
    correctAnswer: 1,
    explanation: 'In the Half-Open state, the circuit breaker allows a trial batch of requests to reach the recovering dependency. If successful, it closes the circuit to resume normal traffic; if they fail, it re-opens to protect the system.'
  },

  // --- ADDITIONAL APTITUDE AND LOGICAL REASONING ---
  {
    id: 'apt-6',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'A train travels 360 km in 4 hours. What is its speed in meters per second (m/s)?',
    options: ['20 m/s', '25 m/s', '30 m/s', '90 m/s'],
    correctAnswer: 1,
    explanation: 'Speed = 360 km / 4 hr = 90 km/hr. To convert km/hr to m/s, multiply by 5/18: 90 * (5/18) = 25 m/s.'
  },
  {
    id: 'apt-7',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'If 6 workers can construct a wall in 10 days, how many days will 4 workers take to complete the same wall at the same working rate?',
    options: ['12 days', '15 days', '16 days', '20 days'],
    correctAnswer: 1,
    explanation: 'Total work = 6 workers * 10 days = 60 man-days. Days required by 4 workers = 60 / 4 = 15 days.'
  },
  {
    id: 'apt-8',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the next number in the series: 3, 7, 15, 31, 63, ___ ?',
    options: ['125', '126', '127', '128'],
    correctAnswer: 2,
    explanation: 'Pattern: each number is (previous * 2) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1 = 127.'
  },
  {
    id: 'apt-9',
    category: 'Aptitude and Logical Reasoning',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'At what time between 3 o\'clock and 4 o\'clock do the hour and minute hands of a clock coincide?',
    options: ['3:15:00', '16 4/11 minutes past 3', '15 3/11 minutes past 3', '18 minutes past 3'],
    correctAnswer: 1,
    explanation: 'At 3:00, the minute hand is 15 minute spaces behind the hour hand. Relative speed = 55/60 spaces per minute. Time = 15 * (60/55) = 180/11 = 16 4/11 minutes past 3 o\'clock.'
  }
];
