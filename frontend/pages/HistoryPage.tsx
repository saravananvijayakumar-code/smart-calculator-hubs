import { useState, useMemo } from 'react';
import { useCalculatorStore } from '../stores/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  History,
  Search,
  Trash2,
  Star,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Calendar,
  Tag,
  TrendingUp,
} from 'lucide-react';
import type { CalculationHistoryEntry, CalculatorType } from '../types/calculator';
import { ComparisonModal } from '../components/ComparisonModal';

export default function HistoryPage() {
  const {
    history,
    deleteCalculation,
    deleteMultiple,
    clearHistory,
    toggleFavorite,
    updateNotes,
    updateTags,
    toggleComparisonSelection,
    selectedForComparison,
    exportHistory,
  } = useCalculatorStore();

  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CalculatorType | 'all'>('all');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CalculationHistoryEntry | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const calculatorTypes = useMemo(() => {
    const types = new Set(history.map((entry) => entry.calculatorType));
    return Array.from(types).sort();
  }, [history]);

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.calculatorName.toLowerCase().includes(query) ||
          entry.notes?.toLowerCase().includes(query) ||
          entry.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((entry) => entry.calculatorType === filterType);
    }

    if (filterFavorites) {
      filtered = filtered.filter((entry) => entry.favorite);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      return a.calculatorName.localeCompare(b.calculatorName);
    });

    return sorted;
  }, [history, searchQuery, filterType, filterFavorites, sortBy]);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedHistory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedHistory.map((entry) => entry.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      deleteMultiple(selectedItems);
      setSelectedItems([]);
      setShowDeleteDialog(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setSelectedItems([]);
    setShowClearDialog(false);
  };

  const handleExportData = () => {
    try {
      const dataStr = exportHistory();
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: 'History exported!',
        description: `${history.length} calculations exported successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export history. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = (id: string, notes: string) => {
    updateNotes(id, notes);
    setEditingEntry(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatResultPreview = (results: any) => {
    const entries = Object.entries(results).slice(0, 3);
    return entries.map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      return (
        <div key={key} className="text-sm">
          <span className="text-muted-foreground">{formattedKey}:</span>{' '}
          <span className="font-medium">{String(value)}</span>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Calculation History</h1>
          </div>
          <p className="text-muted-foreground">
            View, compare, and manage all your saved calculations
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search calculations, notes, or tags..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {calculatorTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={filterFavorites ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterFavorites(!filterFavorites)}
            >
              <Star className={`w-4 h-4 mr-2 ${filterFavorites ? 'fill-current' : ''}`} />
              Favorites Only
            </Button>

            {selectedItems.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedItems.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </>
            )}

            <div className="ml-auto flex gap-2">
              {selectedForComparison.length >= 2 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowComparisonModal(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Compare ({selectedForComparison.length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {history.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {filteredAndSortedHistory.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={
                selectedItems.length === filteredAndSortedHistory.length &&
                filteredAndSortedHistory.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              Select All ({filteredAndSortedHistory.length} results)
            </span>
          </div>
        )}

        {filteredAndSortedHistory.length === 0 ? (
          <Card className="p-12 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No calculations found</h3>
            <p className="text-muted-foreground">
              {history.length === 0
                ? 'Start using calculators to build your history'
                : 'Try adjusting your filters or search query'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedHistory.map((entry) => (
              <Card key={entry.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedItems.includes(entry.id)}
                    onCheckedChange={() => handleToggleSelect(entry.id)}
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{entry.calculatorName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {entry.calculatorType}
                          </Badge>
                          {entry.favorite && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleFavorite(entry.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            {entry.favorite ? 'Unfavorite' : 'Favorite'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingEntry(entry)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleComparisonSelection(entry.id)}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {selectedForComparison.includes(entry.id)
                              ? 'Remove from Comparison'
                              : 'Add to Comparison'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCalculation(entry.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                      {formatResultPreview(entry.results)}
                    </div>

                    {entry.notes && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        {entry.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Calculations</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItems.length} calculation(s)? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All History</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all calculation history? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Add notes to help you remember this calculation
            </DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add your notes here..."
                defaultValue={editingEntry.notes || ''}
                id="notes-input"
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const notes = (document.getElementById('notes-input') as HTMLTextAreaElement)
                  ?.value;
                if (editingEntry) {
                  handleSaveNotes(editingEntry.id, notes);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ComparisonModal
        open={showComparisonModal}
        onOpenChange={setShowComparisonModal}
      />
    </div>
  );
}
